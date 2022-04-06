import pickle
import random
from collections import namedtuple
import cv2
import lmdb
import numpy as np
from path import Path

Sample = namedtuple('Sample', 'gt_text, file_path')
Batch = namedtuple('Batch', 'imgs, gt_texts, batch_size')


class DataLoaderIAM:
    def __init__(self, data_dir, batch_size, data_split=0.95, fast=True):
        # loads data which corresponds to the IAM format
        self.fast = fast
        self.env = lmdb.open(str(data_dir / 'lmdb'), readonly=True) if fast else None
        self.data_augmentation = False
        self.curr_idx = 0
        self.batch_size = batch_size
        self.samples = []
        f = open(data_dir / 'gt/words.txt')
        chars = set()
        for line in f:
            # ignores comment line
            if not line or line[0] == '#':
                continue
            line_split = line.strip().split(' ')
            # filename: path_part1-path_part2-path_part3:
            #           path_part1/path_part1-path_part2/path_part1-path_part2-path_part3.png
            file_name_split = line_split[0].split('-')
            file_name_subdir = f'{file_name_split[0]}-{file_name_split[1]}'
            file_name = data_dir / 'img' / file_name_split[0] / file_name_subdir / (line_split[0] + '.png')
            if line_split[0] in ['a01-117-05-02', 'r06-022-03-05']:  # known images in the IAM dataset
                continue
            # GT texts are columns starting at 9
            gt_text = ' '.join(line_split[8:])
            chars = chars.union(set(list(gt_text)))
            # puts sample into list
            self.samples.append(Sample(gt_text, file_name))
        # splits into training and validation set: 95% - 5%
        split_idx = int(data_split * len(self.samples))
        self.train_samples, self.validation_samples = self.samples[:split_idx], self.samples[split_idx:]
        # puts words into lists
        self.train_words = [x.gt_text for x in self.train_samples]
        self.validation_words = [x.gt_text for x in self.validation_samples]
        # starts with train set
        self.train_set()
        # lists of all chars in dataset
        self.char_list = sorted(list(chars))

    def train_set(self):
        # switches to randomly subset of the training set
        self.data_augmentation = True
        self.curr_idx = 0
        random.shuffle(self.train_samples)
        self.samples = self.train_samples

    def validation_set(self):
        # switches to validation set
        self.data_augmentation = False
        self.curr_idx = 0
        self.samples = self.validation_samples

    def train_has_next(self):
        return self.curr_idx + self.batch_size <= len(self.samples)  # train set: only full-sized batches

    def validation_has_next(self):
        return self.curr_idx < len(self.samples)  # validation set: allows the last batch to be smaller

    def load_img(self):
        return pickle.loads(self.env.begin().get(Path(self.samples[i].file_path).basename().encode("ascii")))

    def get_next(self):
        batch_range = range(self.curr_idx, min(self.curr_idx + self.batch_size, len(self.samples)))
        images = []
        for i in range(batch_range):
            images.append(self.load_img() if self.fast else cv2.imread(self.samples[i].file_path, cv2.IMREAD_GRAYSCALE))
        self.curr_idx += self.batch_size
        return Batch(images, [self.samples[i].gt_text for i in batch_range], len(images))


class Preprocessor:
    def __init__(self, img_size, padding=0, dynamic_width=False, data_augmentation=False, l_mode=False):
        # initializes preprocessor
        self.img_size = img_size
        self.padding = padding
        self.dynamic_width = dynamic_width
        self.data_augmentation = data_augmentation
        self.l_mode = l_mode

    def _simulate_text_line(self, batch):
        # creates image of a text line by pasting multiple word images into a single image; goes over all batch elements
        res_imgs, res_gt_texts = [], []
        for i in range(batch.batch_size):
            # number of words to put into current line and the concat of the ground truth texts
            num_words = random.randint(1, 8) if self.data_augmentation else 5  # default_num_words = 5
            curr_gt = ' '.join([batch.gt_texts[(i + j) % batch.batch_size] for j in range(num_words)])
            res_gt_texts.append(curr_gt)
            # puts selected word images into list and computes target image size
            sel_imgs = []
            word_seps = [0]
            x = h = w = 0
            for j in range(num_words):
                curr_sel_img = batch.imgs[(i + j) % batch.batch_size]
                curr_word_sep = random.randint(20, 50) if self.data_augmentation else 30  # default_word_sep = 30
                h = max(h, curr_sel_img.shape[0])
                w += curr_sel_img.shape[1]
                sel_imgs.append(curr_sel_img)
                if j + 1 < num_words:
                    w += curr_word_sep
                    word_seps.append(curr_word_sep)
            target = np.ones([h, w], np.uint8) * 255  # puts all the selected word images into target image
            for curr_sel_img, curr_word_sep in zip(sel_imgs, word_seps):
                x += curr_word_sep
                y = (h - curr_sel_img.shape[0]) // 2
                target[y:y + curr_sel_img.shape[0]:, x:x + curr_sel_img.shape[1]] = curr_sel_img
                x += curr_sel_img.shape[1]
            # puts an image of a line into the result
            res_imgs.append(target)
        return Batch(res_imgs, res_gt_texts, batch.batch_size)

    @staticmethod
    def random_odd():
        return random.randint(1, 3) * 2 + 1  # returns a random odd number (3, 5, 7)

    def augmentation(self, img):
        # geometric data augmentation
        wt, ht = self.img_size
        h, w = img.shape
        f = min(wt / w, ht / h)
        fx = f * np.random.uniform(0.75, 1.05)
        fy = f * np.random.uniform(0.75, 1.05)
        # random position around center
        freedom_x = max((wt - fx * w) / 2, 0)
        freedom_y = max((ht - fy * h) / 2, 0)
        tx = (wt - w * fx) / 2 + np.random.uniform(-freedom_x, freedom_x)
        ty = (ht - h * fy) / 2 + np.random.uniform(-freedom_y, freedom_y)
        # maps an image into target image
        M, target = np.float32([[fx, 0, tx], [0, fy, ty]]), np.ones(self.img_size[::-1]) * 255
        return cv2.warpAffine(img, M, dsize=self.img_size, dst=target, borderMode=cv2.BORDER_TRANSPARENT)

    def process_augmented(self, img):
        if random.random() < 0.25:
            img = cv2.GaussianBlur(img, (Preprocessor.random_odd(), Preprocessor.random_odd()), 0)
        if random.random() < 0.25:
            img = cv2.dilate(img, np.ones((3, 3)))
        if random.random() < 0.25:
            img = cv2.erode(img, np.ones((3, 3)))
        img = self.augmentation(img)
        # photometric data augmentation
        if random.random() < 0.5:
            img = img * (0.25 + random.random() * 0.75)
        if random.random() < 0.25:
            img = np.clip(img + (np.random.random(img.shape) - 0.5) * random.randint(1, 25), 0, 255)
        if random.random() < 0.1:
            img = 255 - img
        return img

    def process_non_augmented(self, img):
        if self.dynamic_width:
            ht = self.img_size[1]
            h, w = img.shape
            f = ht / h
            wt = int(f * w + self.padding)
            wt = wt + (4 - wt) % 4
            tx = (wt - w * f) / 2
            ty = 0
        else:
            wt, ht = self.img_size
            h, w = img.shape
            f = min(wt / w, ht / h)
            tx = (wt - w * f) / 2
            ty = (ht - h * f) / 2
        # maps an image into target image
        M, target = np.float32([[f, 0, tx], [0, f, ty]]), np.ones([ht, wt]) * 255
        return cv2.warpAffine(img, M, dsize=(wt, ht), dst=target, borderMode=cv2.BORDER_TRANSPARENT)

    def process_img(self, img):
        # resizes to target size, apply data augmentation. there are damaged files in dataset, use black image instead
        img = np.zeros(self.img_size[::-1]).astype(np.float) if img is None else img.astype(np.float)
        # data augmentation (photometric)                                # no data augmentation
        img = self.process_augmented(img) if self.data_augmentation else self.process_non_augmented(img)
        return cv2.transpose(img) / 255 - 0.5  # transpose for TF and convert to range [-1, 1]

    def process_batch(self, batch):
        if self.l_mode:
            batch = self._simulate_text_line(batch)
        res_imgs = [self.process_img(img) for img in batch.imgs]
        max_text_len = res_imgs[0].shape[0] // 4
        # ctc_loss function cannot compute the loss if it cannot find any mapping between text labels and input labels.
        # repeats letters cost double because of the blank symbol need to be inserted.
        # if the label is too-long label, ctc_loss returns an infinite gradient
        res_gt_texts = []
        for gt_text in batch.gt_texts:
            cost = 0
            for i in range(len(gt_text)):
                if i != 0 and gt_text[i] == gt_text[i - 1]:
                    cost += 1
                cost += 1
                if cost > max_text_len:
                    res_gt_texts.append(gt_text[:i])
            res_gt_texts.append(gt_text)
        return Batch(res_imgs, res_gt_texts, batch.batch_size)
