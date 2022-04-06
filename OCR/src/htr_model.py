import os
from typing import List
import numpy as np
import tensorflow as tf
from htr_preprocessing import Batch

tf.compat.v1.disable_eager_execution()  # disables eager mode

DecoderType = {'BestPath': 0, 'BeamSearch': 1, 'WordBeamSearch': 2}  # CTC decoder types


class Model:
    def __init__(self, char_list, decoder_type=DecoderType['BestPath'], must_restore=False, dump=False):
        tf.compat.v1.reset_default_graph()
        self.dump = dump
        self.char_list = char_list
        self.decoder_type = decoder_type
        self.must_restore = must_restore
        # whether to use normalization over a batch or a population
        self.is_train = tf.compat.v1.placeholder(tf.bool, name='is_train')  # whether using normal. on batch\ population
        self.input_imgs = tf.compat.v1.placeholder(tf.float32, shape=(None, None, None))  # input image batch
        # sets up CNN, RNN, CTC and Adam optimizer
        self.init_cnn()
        self.init_rnn()
        self.init_ctc()
        with tf.control_dependencies(tf.compat.v1.get_collection(tf.compat.v1.GraphKeys.UPDATE_OPS)):
            self.optimizer = tf.compat.v1.train.AdamOptimizer().minimize(self.loss)
        self.sess, self.saver = self.init_tensorflow()

    def init_cnn(self):
        # list of parameters for the layers' creation
        kernel_values = [5, 5, 3, 3, 3]
        feature_values = [1, 32, 64, 128, 128, 256]
        pool_values = [(2, 2), (2, 2), (1, 2), (1, 2), (1, 2)]  # the stride's values
        num_layers = len(pool_values)
        pool = tf.expand_dims(input=self.input_imgs, axis=3)
        for i in range(num_layers):
            truncated_n = [kernel_values[i], kernel_values[i], feature_values[i], feature_values[i + 1]]
            kernel = tf.Variable(tf.random.truncated_normal(truncated_n, stddev=0.1))
            conv = tf.nn.conv2d(input=pool, filters=kernel, padding='SAME', strides=(1, 1, 1, 1))
            conv_norm = tf.compat.v1.layers.batch_normalization(conv, training=self.is_train)
            size = (1, pool_values[i][0], pool_values[i][1], 1)
            pool = tf.nn.max_pool2d(input=tf.nn.relu(conv_norm), ksize=size, strides=size, padding='VALID')
        self.cnn_out_4d = pool

    def word_beam_decoder_type(self):
        chars = ''.join(self.char_list).encode('utf8')
        word_chars = open('../model/wordCharList.txt').read().splitlines()[0].encode('utf8')
        # decodes using this mode of word beam search: the input to the decoder must have applied softmax
        from word_beam_search import WordBeamSearch
        self.wbs_input = tf.nn.softmax(self.ctc_tbc, axis=2)
        return WordBeamSearch(50, 'Words', 0.0, open('../data/corpus.txt').read().encode('utf8'), chars, word_chars)

    def set_decoder(self):
        if self.decoder_type == DecoderType['BestPath']:
            self.decoder = tf.nn.ctc_greedy_decoder(inputs=self.ctc_tbc, sequence_length=self.seq_len)
        elif self.decoder_type == DecoderType['BeamSearch']:
            self.decoder = tf.nn.ctc_beam_search_decoder(inputs=self.ctc_tbc, sequence_length=self.seq_len, beam_width=50)
        elif self.decoder_type == DecoderType['WordBeamSearch']:
            self.decoder = self.word_beam_decoder_type()  # word beam search decoding: prepares information related to NLP

    def init_rnn(self):
        rnn_3d = tf.squeeze(self.cnn_out_4d, axis=[2])
        # basic cells which is used to build RNN and stack basic cells (creation of a bidirectional RNN)
        cells = [tf.compat.v1.nn.rnn_cell.LSTMCell(num_units=256, state_is_tuple=True) for _ in range(2)]  # 2 layers
        stacked = tf.compat.v1.nn.rnn_cell.MultiRNNCell(cells, state_is_tuple=True)
        (f, b), _ = tf.compat.v1.nn.bidirectional_dynamic_rnn(cell_fw=stacked, cell_bw=stacked, inputs=rnn_3d, dtype=rnn_3d.dtype)
        concat = tf.expand_dims(tf.concat([f, b], 2), 2)
        kernel = tf.Variable(tf.random.truncated_normal([1, 1, 256 * 2, len(self.char_list) + 1], stddev=0.1))
        at_conv = tf.nn.atrous_conv2d(value=concat, filters=kernel, rate=1, padding='SAME')
        self.rnn_out_3d = tf.squeeze(at_conv, axis=[2])

    def init_ctc(self):
        self.ctc_tbc = tf.transpose(a=self.rnn_out_3d, perm=[1, 0, 2])
        # the ground truth text (as a sparse tensor)
        first_ph = tf.compat.v1.placeholder(tf.int32, [None])
        second_ph = tf.compat.v1.placeholder(tf.int64, [2])
        self.gt_texts = tf.SparseTensor(tf.compat.v1.placeholder(tf.int64, shape=[None, 2]), first_ph, second_ph)
        self.seq_len = tf.compat.v1.placeholder(tf.int32, [None])
        it = tf.compat.v1.nn.ctc_loss(labels=self.gt_texts, inputs=self.ctc_tbc,
                                      sequence_length=self.seq_len, ctc_merge_repeated=True)
        self.loss = tf.reduce_mean(input_tensor=it)
        # calcs the loss for each element to compute label probability
        self.saved_ctc_input = tf.compat.v1.placeholder(tf.float32, shape=[None, None, len(self.char_list) + 1])
        self.loss_per_element = tf.compat.v1.nn.ctc_loss(labels=self.gt_texts, inputs=self.saved_ctc_input,
                                                         sequence_length=self.seq_len, ctc_merge_repeated=True)
        self.set_decoder()

    def init_tensorflow(self):
        sess = tf.compat.v1.Session()  # tensorflow session
        saver = tf.compat.v1.train.Saver(max_to_keep=1)  # saver saves model to file
        late_snapshot = tf.train.latest_checkpoint('../model/')  # checks whether there is any saved model
        # if the model must be restored (for example, for inference), there must be any snapshot
        if self.must_restore and not late_snapshot:
            raise Exception('No saved model found in model directory')
        # load saved model if available
        saver.restore(sess, late_snapshot) if late_snapshot else sess.run(tf.compat.v1.global_variables_initializer())
        return sess, saver

    def to_sparse(self, texts):
        # puts the ground truth texts into a tensor for calculating the CTC's loss
        indices, values = [], []
        shape = [len(texts), 0]  # last entry must be max(labelList[i])
        # goes over all texts: converts to string of label --> sparses tensor must have size of maximal label-string
        for batch_element, text in enumerate(texts):
            label_str = [self.char_list.index(c) for c in text]
            lbl_len = len(label_str)
            if lbl_len > shape[1]:
                shape[1] = lbl_len
            for i, label in enumerate(label_str):
                indices.append([batch_element, i])
                values.append(label)
        return indices, values, shape

    def decoder_output_to_text(self, ctc_output, batch_size):
        # extracts texts from output of the CTC (word beam search: already contains label strings)
        if self.decoder_type == DecoderType['WordBeamSearch']:
            label_strs = ctc_output
        else:
            # tensorflow decoders --> labeled strings containing sparse tensors.
            # ctc returns tuple, first element is SparseTensor
            dcd = ctc_output[0][0]
            # contains string of labels for each batch element
            label_strs = [[] for _ in range(batch_size)]
            # goes over the indices and saves the mapping of the batch to values
            for (idx, idx2d) in enumerate(dcd.indices):
                label_strs[idx2d[0]].append(dcd.values[idx])  # appends a label; the index is according to [b,t]
        # maps labels to chars for all the batches' elements
        return [''.join([self.char_list[c] for c in labelStr]) for labelStr in label_strs]

    def train_batch(self, batch):
        # feeds a batch into the NN for training
        m = batch.imgs[0].shape[0] // 4
        s = self.to_sparse(batch.gt_texts)
        f_d = {self.input_imgs: batch.imgs, self.gt_texts: s, self.seq_len: [m] * len(batch.imgs), self.is_train: True}
        _, loss_val = self.sess.run([self.optimizer, self.loss], f_d)
        return loss_val

    def infer_calc(self, calc_probability, batch, gt_probability, texts, ctc_input, max_text_len, num_batch_elements):
        if calc_probability:
            sparse = self.to_sparse(batch.gt_texts) if gt_probability else self.to_sparse(texts)
            sl = [max_text_len] * num_batch_elements
            feed_dict = {self.saved_ctc_input: ctc_input, self.gt_texts: sparse, self.seq_len: sl, self.is_train: False}
            return np.exp(-self.sess.run(self.loss_per_element, feed_dict))  # e^(-loss_values)
        return None

    def evaluate_tensors(self, calc_probability):
        # puts tensors to be evaluated into lst
        lst = []
        lst.append(self.wbs_input) if self.decoder_type == DecoderType['WordBeamSearch'] else lst.append(self.decoder)
        if self.dump or calc_probability:
            lst.append(self.ctc_tbc)
        return lst

    def infer_batch(self, batch, calc_probability=False, probability_of_gt=False):
        # feeds a batch into the NN for recognizing the texts decode
        n_batch_elements = len(batch.imgs)
        eval_list = self.evaluate_tensors(calc_probability)
        # the sequence's length depends on the given image size (the model downsizes its width by 4)
        max_t_len = batch.imgs[0].shape[0] // 4
        # the dictionary containing all the tensor fed into the model and evaluates it
        f_d = {self.input_imgs: batch.imgs, self.seq_len: [max_t_len] * n_batch_elements, self.is_train: False}
        eval_res = self.sess.run(eval_list, f_d)
        # tensorflow's decoder already done in a tensorflow graph
        dcd = eval_res[0] if self.decoder_type != DecoderType['WordBeamSearch'] else self.decoder.compute(eval_res[0])
        # maps labels (numbers) into character string
        texts = self.decoder_output_to_text(dcd, n_batch_elements)
        # feeds output and recognized text into CTC loss to compute the probability and dumps the NN's output o CSV
        p = self.infer_calc(calc_probability, batch, probability_of_gt, texts, eval_res[1], max_t_len, n_batch_elements)
        # dumps the output of the NN to CSV files
        if self.dump:
            Model.dump_nn_output(eval_res[1])
        return texts, p

    @staticmethod
    def dump_nn_output(rnn_output):
        # dumps the NN's output to CSV files and iterates over all batches
        dump_dir = '../dump/'
        if not os.path.isdir(dump_dir):
            os.mkdir(dump_dir)
        max_t, max_b, max_c = rnn_output.shape
        for b in range(max_b):
            csv = ''
            for t in range(max_t):
                for c in range(max_c):
                    csv += str(rnn_output[t, b, c]) + ';'
                csv += '\n'
            with open(dump_dir + 'rnnOutput_' + str(b) + '.csv', 'w') as f:
                f.write(csv)
