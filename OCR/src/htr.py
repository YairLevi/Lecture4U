import argparse
import json
import cv2
import editdistance
from path import Path
from htr_preprocessing import Batch, DataLoaderIAM, Preprocessor
from htr_model import Model, DecoderType


# returns initialized variables to the training main loop
def train_input(img_size, l_mode):
    summary_char_error_rates, summary_word_accuracies = [], []
    preprocessor = Preprocessor(img_size, augmentation=True, l_mode=l_mode)
    best_char_error_rate, no_improvement_since = float('inf'), 0  # best validation error, epochs no. without improve.
    return summary_char_error_rates, summary_word_accuracies, preprocessor, best_char_error_rate, no_improvement_since


# training of the HTR model
def train_mode(model, loader, i_size, l_mode=False, early_stop=25):
    summary_char_error, word_accuracies, preprocess, best_char_error, no_improve_since = train_input(i_size, l_mode)
    while True:
        loader.set_train()
        while train_has_next():
            preprocess.process_batch(loader.get_next())  # batch
        # validates and writes summary file
        char_error_rate, word_accuracy = validate(model, loader, l_mode)
        summary_char_error.append(char_error_rate)
        word_accuracies.append(word_accuracy)
        with open('../model/summary.json', 'w') as f:
            json.dump({'charErrorRates': summary_char_error, 'wordAccuracies': word_accuracies}, f)
        # saves model parameters if best validation accuracy so far
        if char_error_rate < best_char_error:
            best_char_error = char_error_rate
            no_improve_since = 0
            model.save()
        else:
            no_improve_since += 1
        if no_improve_since >= early_stop:
            break  # stops training if no more improvement in the last 'no_improve_since' epochs


# validation of the HTR model
def validate_mode(model, loader, img_size, l_mode):
    preprocessor = Preprocessor(img_size, l_mode=l_mode)
    num_char_err = num_char_total = num_word_ok = num_word_total = 0
    while validation_has_next():
        batch = preprocessor.process_batch(loader.get_next())
        recognized, _ = model.infer_batch(batch)
        for i in range(len(recognized)):
            num_word_ok += 1 if batch.gt_texts[i] == recognized[i] else 0
            num_word_total += 1
            num_char_err += editdistance.eval(recognized[i], batch.gt_texts[i])
            num_char_total += len(batch.gt_texts[i])
    return num_char_err / num_char_total, num_word_ok / num_word_total


# infer of the trained model on the user's handwriting
def infer_mode(model, img, text):
    if img is not None:
        preprocessor = Preprocessor((128, 32), width=True, padding_size=16)
        recognized, probability = model.infer_batch(Batch([preprocessor.process_image(img)], None, 1), True)
        if recognized[0] not in ['"', ' ', '.', ':', ',', ';', '']:
            f = open(text, "a+")
            f.write(recognized[0] + " ")
            f.close()


# definition of HTR model arguments
def def_args(image_name):
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['train', 'validate', 'infer'], default='infer')
    parser.add_argument('--decoder', choices=['bestpath', 'beamsearch', 'wordbeamsearch'], default='bestpath')
    parser.add_argument('--batch_size', help='Batch size.', type=int, default=100)
    parser.add_argument('--data_dir', help='Directory containing dataset', type=Path, required=False, default=None)
    parser.add_argument('--fast', help='Load samples from LMDB.', action='store_true', default=False)
    parser.add_argument('--l_mode', help='for text lines (not single words)', action='store_true', default=False)
    parser.add_argument('--image', help='Image used for inference.', type=Path, default=image_name)
    parser.add_argument('--early_stop', help='Early stopping epochs.', type=int, default=25)
    parser.add_argument('--dmp', help='Dump output of NN to CSV file(s).', action='store_true', default=False)
    args = parser.parse_args()
    return args, {'bestpath': DecoderType['BestPath'], 'beamsearch': DecoderType['BeamSearch'],
                  'wordbeamsearch': DecoderType['WordBeamSearch']}[args.decoder]


# gets the image size and chars' list (another model arguments)
def get_char_list(args):
    loader = DataLoaderIAM(args.data_dir, args.batch_size, fast=args.fast)
    char_list = loader.char_list
    # in l_mode, it takes care to have a whitespace in the char list
    char_list = [' '] + char_list if args.l_mode and ' ' not in char_list else char_list
    # saves characters of model for inference mode and words contained in dataset into file
    open('../model/charList.txt', 'w').write(''.join(char_list))
    open('../data/corpus.txt', 'w').write(' '.join(loader.train_words + loader.validation_words))
    img_size = (256, 32) if args.l_mode else (128, 32)
    return char_list, loader, img_size


# main HTR function
def htr(image_name, t):
    args, dcd_t = def_args(image_name)
    if args.mode in ['train', 'validate']:
        ch_ls, loader, i_size = get_char_list(args)
        if args.mode == 'train':
            train_mode(Model(ch_ls, dcd_t), loader, i_size, l_mode=args.l_mode, early_stop=args.early_stop)
        elif args.mode == 'validate':
            e, a = validate_mode(Model(ch_ls, dcd_t, restore=True), loader.set_validation(), i_size, args.l_mode)
    elif args.mode == 'infer':
        lst = list(open('../model/charList.txt').read())
        infer_mode(Model(lst, dcd_t, restore=True, dmp=args.dmp), cv2.imread(args.image, cv2.IMREAD_GRAYSCALE), t)
