import os
from typing import List
import numpy as np
import tensorflow as tf
from htr_preprocessing import Batch
from word_beam_search import WordBeamSearch

tf.compat.v1.disable_eager_execution()  # disables eager mode

# CTC decoder types
DecoderType = {'BestPath': 0, 'BeamSearch': 1, 'WordBeamSearch': 2}


class Model:
    def __init__(self, char_list, decoder_type=DecoderType['BestPath'], must_restore=False, dump=False):
        # initializes model with CNN, RNN and CTC
        tf.compat.v1.reset_default_graph()
        self.dump = dump
        self.char_list = char_list
        self.decoder_type = decoder_type
        self.must_restore = must_restore
        # whether to use normalization over a batch or a population
        self.is_train = tf.compat.v1.placeholder(tf.bool, name='is_train')
        # input image batch
        self.input_imgs = tf.compat.v1.placeholder(tf.float32, shape=(None, None, None))
        # setup CNN, RNN, CTC and Adam optimizer
        self.setup_cnn()
        self.setup_rnn()
        self.setup_ctc()
        self.update_ops = tf.compat.v1.get_collection(tf.compat.v1.GraphKeys.UPDATE_OPS)
        with tf.control_dependencies(self.update_ops):
            self.optimizer = tf.compat.v1.train.AdamOptimizer().minimize(self.loss)
        self.sess, self.saver = self.setup_tf()

    def setup_cnn(self):
        # list of parameters for the layers
        kernel_values = [5, 5, 3, 3, 3]
        feature_values = [1, 32, 64, 128, 128, 256]
        stride_values = pool_values = [(2, 2), (2, 2), (1, 2), (1, 2), (1, 2)]
        num_layers = len(stride_values)
        # create layers
        pool = tf.expand_dims(input=self.input_imgs, axis=3)
        for i in range(num_layers):
            tn = [kernel_values[i], kernel_values[i], feature_values[i], feature_values[i + 1]]
            kernel = tf.Variable(tf.random.truncated_normal(tn, stddev=0.1))
            conv = tf.nn.conv2d(input=pool, filters=kernel, padding='SAME', strides=(1, 1, 1, 1))
            conv_norm = tf.compat.v1.layers.batch_normalization(conv, training=self.is_train)
            relu = tf.nn.relu(conv_norm)
            mp_strides = (1, stride_values[i][0], stride_values[i][1], 1)
            size = (1, pool_values[i][0], pool_values[i][1], 1)
            pool = tf.nn.max_pool2d(input=relu, ksize=size, strides=mp_strides, padding='VALID')
        self.cnn_out_4d = pool

    def set_decoder(self):
        # word beam search decoding: prepares information about natural languages
        d = None
        if self.decoder_type == DecoderType['BestPath']:
            d = tf.nn.ctc_greedy_decoder(inputs=self.ctc_tbc, sequence_length=self.seq_len)
        elif self.decoder_type == DecoderType['BeamSearch']:
            d = tf.nn.ctc_beam_search_decoder(inputs=self.ctc_tbc, sequence_length=self.seq_len, beam_width=50)
        elif self.decoder_type == DecoderType['WordBeamSearch']:
            chars = ''.join(self.char_list)
            word_chars = open('../model/wordCharList.txt').read().splitlines()[0]
            corpus = open('../data/corpus.txt').read()
            # decode using the "Words" mode of word beam search: the input to the decoder must have applied softmax
            d = WordBeamSearch(50, 'Words', 0.0, corpus.encode('utf8'), chars.encode('utf8'), word_chars.encode('utf8'))
            self.wbs_input = tf.nn.softmax(self.ctc_tbc, axis=2)
        self.decoder = d

    def setup_rnn(self):
        rnn_3d = tf.squeeze(self.cnn_out_4d, axis=[2])
        # basic cells which is used to build RNN and stack basic cells
        hidden_num = 256
        cells = [tf.compat.v1.nn.rnn_cell.LSTMCell(num_units=hidden_num, state_is_tuple=True) for _ in range(2)]  # 2 ls
        stacked = tf.compat.v1.nn.rnn_cell.MultiRNNCell(cells, state_is_tuple=True)
        # bidirectional RNN
        # BxTxF -> BxTx2H
        t = rnn_3d.dtype
        (f, b), _ = tf.compat.v1.nn.bidirectional_dynamic_rnn(cell_fw=stacked, cell_bw=stacked, inputs=rnn_3d, dtype=t)
        # BxTxH + BxTxH -> BxTx2H -> BxTx1X2H
        concat = tf.expand_dims(tf.concat([f, b], 2), 2)
        # project output to chars (including blank): BxTx1x2H -> BxTx1xC -> BxTxC
        kernel = tf.Variable(tf.random.truncated_normal([1, 1, hidden_num * 2, len(self.char_list) + 1], stddev=0.1))
        at_cov = tf.nn.atrous_conv2d(value=concat, filters=kernel, rate=1, padding='SAME')
        self.rnn_out_3d = tf.squeeze(at_cov, axis=[2])

    def setup_ctc(self):
        # BxTxC -> TxBxC
        self.ctc_tbc = tf.transpose(a=self.rnn_out_3d, perm=[1, 0, 2])
        # ground truth text as sparse tensor
        shaped_64 = tf.compat.v1.placeholder(tf.int64, shape=[None, 2])
        non_shaped_32 = tf.compat.v1.placeholder(tf.int32, [None])
        non_shaped_64 = tf.compat.v1.placeholder(tf.int64, [2])
        self.gt_texts = tf.SparseTensor(shaped_64, non_shaped_32, non_shaped_64)
        # calc loss for batch
        self.seq_len = tf.compat.v1.placeholder(tf.int32, [None])
        it = tf.compat.v1.nn.ctc_loss(labels=self.gt_texts, inputs=self.ctc_tbc, sequence_length=self.seq_len, ctc_merge_repeated=True)
        self.loss = tf.reduce_mean(input_tensor=it)
        # calc loss for each element to compute label probability
        self.saved_ctc_input = tf.compat.v1.placeholder(tf.float32, shape=[None, None, len(self.char_list) + 1])
        self.loss_per_element = tf.compat.v1.nn.ctc_loss(labels=self.gt_texts, inputs=self.saved_ctc_input,
                                                         sequence_length=self.seq_len, ctc_merge_repeated=True)
        self.set_decoder()

    def setup_tf(self):
        sess = tf.compat.v1.Session()  # TF session
        saver = tf.compat.v1.train.Saver(max_to_keep=1)  # saver saves model to file
        model_dir = '../model/'
        latest_snapshot = tf.train.latest_checkpoint(model_dir)  # is there a saved model?
        # if model must be restored (for inference), there must be a snapshot
        if self.must_restore and not latest_snapshot:
            raise Exception('No saved model found in: ' + model_dir)
        # load saved model if available
        if latest_snapshot:
            saver.restore(sess, latest_snapshot)
        else:
            sess.run(tf.compat.v1.global_variables_initializer())
        return sess, saver

    def to_sparse(self, texts):
        # puts ground truth texts into a tensor for ctc_loss
        indices, values = [], []
        shape = [len(texts), 0]  # last entry must be max(labelList[i])
        # goes over all texts: converts to string of label --> sparses tensor must have size of maximal label-string
        for batchElement, text in enumerate(texts):
            label_str = [self.char_list.index(c) for c in text]
            if len(label_str) > shape[1]:
                shape[1] = len(label_str)
            for i, label in enumerate(label_str):
                indices.append([batchElement, i])
                values.append(label)
        return indices, values, shape

    def decoder_output_to_text(self, ctc_output, batch_size):
        # extracts texts from output of the CTC (word beam search: already contains label strings)
        if self.decoder_type == DecoderType['WordBeamSearch']:
            label_strs = ctc_output
        # TF decoders: label strings are contained in sparse tensor
        else:
            # ctc returns tuple, first element is SparseTensor
            decoded = ctc_output[0][0]
            # contains string of labels for each batch element
            label_strs = [[] for _ in range(batch_size)]
            # go over all indices and save mapping: batch -> values
            for (idx, idx2d) in enumerate(decoded.indices):
                label = decoded.values[idx]
                label_strs[idx2d[0]].append(label)  # index according to [b,t]
        # map labels to chars for all batch elements
        return [''.join([self.char_list[c] for c in labelStr]) for labelStr in label_strs]

    # feeds a batch into the NN for training
    def train_batch(self, batch):
        max_text_len = batch.imgs[0].shape[0] // 4
        sparse = self.to_sparse(batch.gt_texts)
        eval_list = [self.optimizer, self.loss]
        sl = [max_text_len] * len(batch.imgs)
        feed_dict = {self.input_imgs: batch.imgs, self.gt_texts: sparse, self.seq_len: sl, self.is_train: True}
        _, loss_val = self.sess.run(eval_list, feed_dict)
        return loss_val

    def infer_calc(self, calc_probability, batch, gt_probability, texts, ctc_input, max_text_len, num_batch_elements):
        if calc_probability:
            sparse = self.to_sparse(batch.gt_texts) if gt_probability else self.to_sparse(texts)
            sl = [max_text_len] * num_batch_elements
            feed_dict = {self.saved_ctc_input: ctc_input, self.gt_texts: sparse, self.seq_len: sl, self.is_train: False}
            loss_values = self.sess.run(self.loss_per_element, feed_dict)
            return np.exp(-loss_values)
        return None

    # put tensors to be evaluated into list
    def evaluate_tensors(self, calc_probability):
        eval_list = []
        if self.decoder_type == DecoderType['WordBeamSearch']:
            eval_list.append(self.wbs_input)
        else:
            eval_list.append(self.decoder)
        if self.dump or calc_probability:
            eval_list.append(self.ctc_tbc)
        return eval_list

    def infer_batch(self, batch, calc_probability=False, probability_of_gt=False):
        # feeds a batch into the NN for recognizing the texts decode, optionally save RNN output
        n_batch_elements = len(batch.imgs)
        eval_list = self.evaluate_tensors(calc_probability)
        # sequence length depends on input image size (model downsizes width by 4)
        max_t_len = batch.imgs[0].shape[0] // 4
        # dict containing all tensor fed into the model and evaluates it
        feed_dict = {self.input_imgs: batch.imgs, self.seq_len: [max_t_len] * n_batch_elements, self.is_train: False}
        eval_res = self.sess.run(eval_list, feed_dict)
        # TF decoders: decoding already done in TF graph; WordBeam search decoder: decoding is done in C++ computation
        dcd = eval_res[0] if self.decoder_type != DecoderType['WordBeamSearch'] else self.decoder.compute(eval_res[0])
        # map labels (numbers) to character string
        texts = self.decoder_output_to_text(dcd, n_batch_elements)
        # feeds output and recognized text into CTC loss to compute the probability and dumps the NN's output o CSV
        p = self.infer_calc(calc_probability, batch, probability_of_gt, texts, eval_res[1], max_t_len, n_batch_elements)
        # dumps the output of the NN to CSV files
        if self.dump:
            Model.dump_nn_output(eval_res[1])
        return texts, p

    @staticmethod  # dumps the output of the NN to CSV files and iterates over all batch elements
    def dump_nn_output(rnn_output):
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
