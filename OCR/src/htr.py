import argparse
import json
import cv2
import editdistance
from path import Path
from htr_preprocessing import Batch, DataLoaderIAM, Preprocessor
from htr_model import Model, DecoderType
import sys
import warnings


warnings.filterwarnings('ignore')
old_stdout = sys.stdout  # backup current stdout
sys.stdout = open("errors.txt", "w")


def train(model, loader, img_size, line_mode, early_stopping=25):
    summary_char_error_rates, summary_word_accuracies = [], []
    preprocessor = Preprocessor(img_size, data_augmentation=True, line_mode=line_mode)
    best_char_error_rate = float('inf')  # best validation character error rate
    epoch = no_improvement_since = 0  # number of epochs (general; no improvement of character error rate occurred)
    # stop training after this number of epochs without improvement
    while True:
        epoch += 1
        loader.train_set()
        while train_has_next():
            preprocessor.process_batch(loader.get_next())  # batch
        # validates and writes summary file
        char_error_rate, word_accuracy = validate(model, loader, line_mode)
        summary_char_error_rates.append(char_error_rate)
        summary_word_accuracies.append(word_accuracy)
        with open('../model/summary.json', 'w') as f:
            json.dump({'charErrorRates': summary_char_error_rates, 'wordAccuracies': summary_word_accuracies}, f)
        # saves model parameters if best validation accuracy so far
        if char_error_rate < best_char_error_rate:
            best_char_error_rate = char_error_rate
            no_improvement_since = 0
            model.save()
        else:
            no_improvement_since += 1
        if no_improvement_since >= early_stopping:
            break  # stop training if no more improvement in the last x epochs


def validate(model, loader, img_size, line_mode):
    loader.validation_set()
    preprocessor = Preprocessor(img_size, line_mode=line_mode)
    num_char_err = num_char_total = num_word_ok = num_word_total = 0
    while validation_has_next():
        batch = preprocessor.process_batch(loader.get_next())
        recognized, _ = model.infer_batch(batch)
        for i in range(len(recognized)):
            num_word_ok += 1 if batch.gt_texts[i] == recognized[i] else 0
            num_word_total += 1
            dist = editdistance.eval(recognized[i], batch.gt_texts[i])
            num_char_err += dist
            num_char_total += len(batch.gt_texts[i])
    return num_char_err / num_char_total, num_word_ok / num_word_total


def infer(model, fn_img, text):
    img = cv2.imread(fn_img, cv2.IMREAD_GRAYSCALE)
    if img is not None:
        preprocessor = Preprocessor((128, 32), dynamic_width=True, padding=16)
        recognized, probability = model.infer_batch(Batch([preprocessor.process_img(img)], None, 1), True)
        if recognized[0] not in ['"', ' ', '.', ':', ',', ';', '']:
            f = open(text, "a+")
            f.write(recognized[0] + " ")
            f.close()


def def_args(image_name):
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['train', 'validate', 'infer'], default='infer')
    parser.add_argument('--decoder', choices=['bestpath', 'beamsearch', 'wordbeamsearch'], default='bestpath')
    parser.add_argument('--batch_size', help='Batch size.', type=int, default=100)
    parser.add_argument('--data_dir', help='Directory containing dataset', type=Path, required=False, default=None)
    parser.add_argument('--fast', help='Load samples from LMDB.', action='store_true', default=False)
    parser.add_argument('--line_mode', help='for text lines (not single words)', action='store_true', default=False)
    parser.add_argument('--img_file', help='Image used for inference.', type=Path, default=image_name)
    parser.add_argument('--early_stopping', help='Early stopping epochs.', type=int, default=25)
    parser.add_argument('--dump', help='Dump output of NN to CSV file(s).', action='store_true', default=False)
    args = parser.parse_args()
    return args, {'bestpath': DecoderType['BestPath'], 'beamsearch': DecoderType['BeamSearch'],
                  'wordbeamsearch': DecoderType['WordBeamSearch']}[args.decoder]


def get_char_list(args):
    loader = DataLoaderIAM(args.data_dir, args.batch_size, fast=args.fast)
    char_list = loader.char_list
    # when in line mode, take care to have a whitespace in the char list
    char_list = [' '] + char_list if args.line_mode and ' ' not in char_list else char_list
    # saves characters of model for inference mode and words contained in dataset into file
    open('../model/charList.txt', 'w').write(''.join(char_list))
    open('../data/corpus.txt', 'w').write(' '.join(loader.train_words + loader.validation_words))
    img_size = (256, 32) if args.line_mode else (128, 32)
    return char_list, loader, img_size


def htr(image_name, text):
    args, decoder_type = def_args(image_name)
    if args.mode in ['train', 'validate']:
        char_list, loader, img_size = get_char_list(args)
        if args.mode == 'train':
            train(Model(char_list, decoder_type), loader, img_size, line_mode=args.line_mode, early_stopping=args.early_stopping)
        elif args.mode == 'validate':
            error_rate, accuracy = validate(Model(char_list, decoder_type, must_restore=True), loader, img_size, args.line_mode)
    elif args.mode == 'infer':
        infer(Model(list(open('../model/charList.txt').read()), decoder_type, must_restore=True, dump=args.dump), args.img_file, text)
