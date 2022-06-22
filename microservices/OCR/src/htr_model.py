import os
from typing import List
import numpy as np
import tensorflow as tf
from htr_preprocessing import Batch

tf.compat.v1.disable_eager_execution()  # disables eager mode

DecoderType = {'BestPath': 0, 'BeamSearch': 1, 'WordBeamSearch': 2}  # CTC decoder types


class Model:
    def __init__(self, char_list, dcd_type=DecoderType['BestPath'], restore=False, dmp=False):
        tf.compat.v1.reset_default_graph()
        self.dmp = dmp
        self.char_list = char_list
        self.dcd_type = dcd_type
        self.restore = restore
        # whether to use normalization over a batch or a population
        self.training = tf.compat.v1.placeholder(tf.bool, name='is_train')  # whether using normal. on batch\ population
        self.input_images = tf.compat.v1.placeholder(tf.float32, shape=(None, None, None))  # input image batch
        # sets up CNN, RNN, CTC and Adam optimizer
        self.init_cnn()
        self.init_rnn()
        self.init_ctc()
        with tf.control_dependencies(tf.compat.v1.get_collection(tf.compat.v1.GraphKeys.UPDATE_OPS)):
            self.optimizer = tf.compat.v1.train.AdamOptimizer().minimize(self.loss)
        self.session, self.saver = self.init_tensorflow()

    def init_cnn(self):
        # list of parameters for the layers' creation
        kernel_values = [5, 5, 3, 3, 3]
        feature_values = [1, 32, 64, 128, 128, 256]
        pool_values = [(2, 2), (2, 2), (1, 2), (1, 2), (1, 2)]  # the stride's values
        layers_counter = len(pool_values)
        pool = tf.expand_dims(input=self.input_images, axis=3)
        for i in range(layers_counter):
            truncated_n = [kernel_values[i], kernel_values[i], feature_values[i], feature_values[i + 1]]
            kernel = tf.Variable(tf.random.truncated_normal(truncated_n, stddev=0.1))
            convolution = tf.nn.conv2d(input=pool, filters=kernel, padding='SAME', strides=(1, 1, 1, 1))
            convolution_normalized = tf.compat.v1.layers.batch_normalization(convolution, training=self.training)
            size = (1, pool_values[i][0], pool_values[i][1], 1)
            pool = tf.nn.max_pool2d(input=tf.nn.relu(convolution_normalized), ksize=size, strides=size, padding='VALID')
        self.cnn_out_4d = pool

    def set_decoder(self):
        if self.dcd_type == DecoderType['BestPath']:
            self.decoder = tf.nn.ctc_greedy_decoder(inputs=self.ctc, sequence_length=self.sl)
        elif self.dcd_type == DecoderType['BeamSearch']:
            self.decoder = tf.nn.ctc_beam_search_decoder(inputs=self.ctc, sequence_length=self.sl, beam_width=50)
        elif self.dcd_type == DecoderType['WordBeamSearch']:
            from word_beam_search import WordBeamSearch
            self.decoder = WordBeamSearch(50, 'Words', 0.0, open('../data/corpus.txt').read().encode('utf8'),
                                          ''.join(self.char_list).encode('utf8'),
                                          open('../model/wordCharList.txt').read().splitlines()[0].encode('utf8'))
            # word beam search decoding: prepares information related to NLP:
            # decodes using this mode of word beam search: the input to the decoder must have applied softmax

    def init_rnn(self):
        rnn_3d = tf.squeeze(self.cnn_out_4d, axis=[2])
        t = rnn_3d.dtype
        # basic cells which is used to build RNN and stack basic cells (creation of a bidirectional RNN)
        rnn_cells = [tf.compat.v1.nn.rnn_cell.LSTMCell(num_units=256, state_is_tuple=True) for _ in range(2)]  # 2 ls
        stacked = tf.compat.v1.nn.rnn_cell.MultiRNNCell(rnn_cells, state_is_tuple=True)
        (f, b), _ = tf.compat.v1.nn.bidirectional_dynamic_rnn(cell_fw=stacked, cell_bw=stacked, inputs=rnn_3d, dtype=t)
        k = tf.Variable(tf.random.truncated_normal([1, 1, 256 * 2, len(self.char_list) + 1], stddev=0.1))
        at_conv = tf.nn.atrous_conv2d(value=tf.expand_dims(tf.concat([f, b], 2), 2), filters=k, rate=1, padding='SAME')
        self.rnn_out_3d = tf.squeeze(at_conv, axis=[2])

    def init_ctc(self):
        self.ctc = tf.transpose(a=self.rnn_out_3d, perm=[1, 0, 2])
        # the ground truth text (as a sparse tensor)
        first_ph = tf.compat.v1.placeholder(tf.int32, [None])
        second_ph = tf.compat.v1.placeholder(tf.int64, [2])
        self.texts = tf.SparseTensor(tf.compat.v1.placeholder(tf.int64, shape=[None, 2]), first_ph, second_ph)
        self.sl = tf.compat.v1.placeholder(tf.int32, [None])
        it = tf.compat.v1.nn.ctc_loss(labels=self.texts, inputs=self.ctc,
                                      sequence_length=self.sl, ctc_merge_repeated=True)
        self.loss = tf.reduce_mean(input_tensor=it)
        # calculates the loss for each element to compute label probability
        self.ctc_input = tf.compat.v1.placeholder(tf.float32, shape=[None, None, len(self.char_list) + 1])
        self.elemental_loss = tf.compat.v1.nn.ctc_loss(labels=self.texts, inputs=self.ctc_input,
                                                         sequence_length=self.sl, ctc_merge_repeated=True)
        self.set_decoder()

    def init_tensorflow(self):
        session = tf.compat.v1.Session()  # tensorflow session
        saver = tf.compat.v1.train.Saver(max_to_keep=1)  # saver saves model to file
        last_shot = tf.train.latest_checkpoint('../model/')  # checks whether there is any saved model
        # if the model must be restored (for example, for inference), there must be any snapshot
        if self.restore and not last_shot:
            raise Exception('No saved model found in model directory')
        # load saved model if available
        saver.restore(session, last_shot) if last_shot else sess.run(tf.compat.v1.global_variables_initializer())
        return session, saver

    def sparser(self, texts):
        # puts the ground truth texts into a tensor for calculating the CTC's loss
        indices, values = [], []
        shape = [len(texts), 0]
        # goes over all texts: converts to string of label --> sparses tensor must have size of maximal label-string
        for be, t in enumerate(texts):
            label_str = [self.char_list.index(c) for c in t]
            lbl_len = len(label_str)
            shape[1] = lbl_len if lbl_len > shape[1] else shape[1]
            for i, label in enumerate(label_str):
                indices.append([be, i])
                values.append(label)
        return indices, values, shape

    def text_decoder(self, ctc_output, batch_size):
        # extracts texts from output of the CTC (word beam search: already contains label strings)
        if self.dcd_type == DecoderType['WordBeamSearch']:
            label_strs = ctc_output
        else:
            # tensorflow decoders --> labeled strings containing sparse tensors. returns tuple, 1st element is SparseT
            dcd = ctc_output[0][0]
            # contains string of labels for each batch element
            label_strs = [[] for _ in range(batch_size)]
            # goes over the indices and saves the mapping of the batch to values
            for (idx, idx2d) in enumerate(dcd.indices):
                label_strs[idx2d[0]].append(dcd.values[idx])  # appends a label; the index is according to [b,t]
        # maps labels to chars for all the batches' elements
        return [''.join([self.char_list[c] for c in labelStr]) for labelStr in label_strs]

    def infer_calc(self, calc_probability, batch, gt_probability, texts, ctc_input, mtl, nbe):
        if calc_probability:
            sp = self.sparser(batch.gt_texts) if gt_probability else self.sparser(texts)
            return np.exp(-self.session.run(self.elemental_loss, {self.ctc_input: ctc_input, self.texts: sp,
                                                                  self.sl: [mtl] * nbe,
                                                                  self.training: False}))  # e^(-loss_values)
        return None

    def evaluate_tensors(self, calc_probability):
        # puts tensors to be evaluated into lst
        lst = []
        lst.append(self.wbs_input) if self.dcd_type == DecoderType['WordBeamSearch'] else lst.append(self.decoder)
        if self.dmp or calc_probability:
            lst.append(self.ctc)
        return lst

    def infer_batch(self, batch, calc_probability=False, probability_of_gt=False):
        # feeds a batch into the NN for recognizing the texts decode
        n_batch_elements = len(batch.imgs)
        eval_list = self.evaluate_tensors(calc_probability)
        # the sequence's length depends on the given image size (the model downsizes its width by 4)
        max_t_len = batch.imgs[0].shape[0] // 4
        # the dictionary containing all the tensor fed into the model and evaluates it
        eval_res = self.session.run(eval_list, {self.input_images: batch.imgs, self.sl: [max_t_len] * n_batch_elements,
                                                self.training: False})
        # tensorflow's decoder already done in a tensorflow graph
        dcd = eval_res[0] if self.dcd_type != DecoderType['WordBeamSearch'] else self.decoder.compute(eval_res[0])
        # maps labels (numbers) into character string
        texts = self.text_decoder(dcd, n_batch_elements)
        # feeds output and recognized text into CTC loss to compute the probability and dumps the NN's output o CSV
        p = self.infer_calc(calc_probability, batch, probability_of_gt, texts, eval_res[1], max_t_len, n_batch_elements)
        # dumps the output of the NN to CSV files
        if self.dmp:
            Model.dump_nn_output(eval_res[1])
        return texts, p

    @staticmethod
    def write_to_csv(m_t, m_c, dmp_dir):
        csv = ''
        for t in range(m_t):
            for c in range(m_c):
                csv += str(rnn_output[t, b, c]) + ';'
            csv += '\n'
        with open(dmp_dir + 'rnnOutput_' + str(b) + '.csv', 'w') as f:
            f.write(csv)

    @staticmethod
    def dump_nn_output(rnn_output):
        # dumps the NN's output to CSV files and iterates over all batches
        dmp_dir = '../dump/'
        if not os.path.isdir(dmp_dir):
            os.mkdir(dmp_dir)
        m_t, m_b, m_c = rnn_output.shape
        for b in range(m_b):
            write_to_csv(m_t, m_c, dmp_dir)
