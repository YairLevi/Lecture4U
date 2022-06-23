import glob
from htr import htr
import os
from evaluate import evaluate
import docx
from pathlib import Path
import cv2
import sys
import warnings
from threading import Thread, Semaphore
import time
import shutil

THREADS_COUNTER = 4
LINES_ROI = "../ROIS"
WORDS_ROI = "../ROI"
LINES_ROI_PNG = LINES_ROI + "/*.png"
PNG_SUFFIX = "/*.png"
INPUT_IMAGE_PATH = "../image examples/"
dir_lst = []
png_lst = []


def get_image_param(contours, height_threshold, width_threshold, img):
    my_list = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        ROI = img[y:y + h, x:x + w]
        # checks whether the size of the ROI is too small --> indicates there is no additional text in the rectangle
        threshold_smaller = ROI.shape[0] < height_threshold or ROI.shape[1] < width_threshold
        if threshold_smaller or ((ROI.shape[0] < 2 * height_threshold) and (ROI.shape[1] < 2 * width_threshold)):
            continue
        my_list.append((x, y, w, h))
    return my_list


# creates new images from a given image (text --> lines; lines --> words) into ROIs\ROIw folders
def split_image_text(image_name, target_dir, kernel_size, is_line):
    img = cv2.imread(image_name, 1)
    b2g = cv2.COLOR_BGR2GRAY
    # finds the optimal threshold to the image, which is called Otsu threshold (optimal k-means for back & foreground).
    # for more information on Otsu binarization: https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html
    r, t = cv2.threshold(cv2.cvtColor(img, b2g), 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    # finds an operation which will form a region along the horizontal axis.
    # chooses a kernel which: width > height --> choosing the right kernel (according user's choice)
    dilation = cv2.dilate(t, cv2.getStructuringElement(shape=cv2.MORPH_RECT, ksize=(kernel_size, 1)), iterations=1)
    # bounds the contours and iterates through them. extracts the ROI using Numpy (slices)
    contours, hierarchy = cv2.findContours(dilation, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    copied = img.copy()
    h_thresh = w_thresh = 10
    my_list = get_image_param(contours, h_thresh, w_thresh, img)
    if not is_line:
        my_list.sort(key=lambda z: z[0])
    idx = len(my_list)
    for i, c in enumerate(my_list):
        x, y, w, h = c[0], c[1], c[2], c[3]
        cv2.rectangle(copied, (x, y), (x + w, y + h), (36, 255, 12), 2)
        # converts the image to black and white
        r, t = cv2.threshold(cv2.cvtColor(img[y:y + h, x:x + w], b2g), 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
        if is_line:
            cv2.imwrite(target_dir + '/{:02d}.png'.format(idx), 255 - cv2.cvtColor(t, cv2.COLOR_BGR2RGB))
            idx -= 1
        else:
            cv2.imwrite(target_dir + '/{:04d}.png'.format(x), 255 - cv2.cvtColor(t, cv2.COLOR_BGR2RGB))
    return cv2.cvtColor(copied, cv2.COLOR_BGR2RGB)


# initializes the input files (creates an empty evaluation file or deletes the existing evaluation file)
def init_htr(to_eval):
    evaluation = "evaluation.txt"
    if to_eval:
        open(evaluation, "w").close()
    elif Path(evaluation).is_file():
        os.remove(evaluation)
    fn = open("filename.txt", "r+")
    filename = fn.read()
    fn.close()
    return evaluation, filename


# removes the temporary images
def remove_irrelevant_images(p):
    for img in glob.glob(p):
        os.remove(img)


def thread_parse_line(lines_dict, i, current_line, sem, ll, t_count):
    line_text = ""
    for img in current_line:
        line_text = line_text + htr(img)
    if ll > 1:
        line_text = line_text[:-1] + "\n"
    is_changed = False
    while not is_changed:
        sem.acquire()
        lines_dict[i] = line_text
        is_changed = True
        sem.release()
        time.sleep(0.05)
    remove_irrelevant_images(png_lst[i % t_count])


# for each line, it parses the image into words and transcripts it into words and writes to the file
def handle_htr(words_split_const, t_count, ll):
    lines = glob.glob(LINES_ROI_PNG)
    new_text, lines_dict = "", {}
    threads = [None] * t_count
    sem = Semaphore()
    for i in range(ll):
        r = i % t_count
        split_image_text(lines[i], dir_lst[r], words_split_const, False)
        current_line = glob.glob(png_lst[r])
        threads[r] = Thread(target=thread_parse_line, args=(lines_dict, i, current_line, sem, ll, t_count))
        threads[r].start()
        threads[r].join()
    remove_irrelevant_images(LINES_ROI_PNG)
    keys = list(lines_dict.keys())
    keys.sort()
    for k in keys:
        new_text = new_text + lines_dict[k]
    if ll == 1:
        new_text = new_text[:-1]
    return new_text


def delete_temp_dirs(t_count):
    for i in range(t_count):
        c = WORDS_ROI + str(i + 1)
        os.chmod(c, 0o777)
        shutil.rmtree(c)


def create_temp_dirs(t_count):
    for i in range(t_count):
        c = WORDS_ROI + str(i + 1)
        remove_irrelevant_images(c + PNG_SUFFIX) if Path(c).is_dir() else os.mkdir(c)
        dir_lst.append(c)
        png_lst.append(c + PNG_SUFFIX)


def process_data(words_split):
    glob_len = len(glob.glob(LINES_ROI_PNG))
    t_count = THREADS_COUNTER if glob_len < THREADS_COUNTER else THREADS_COUNTER
    create_temp_dirs(t_count)
    return handle_htr(words_split, t_count, glob_len), t_count


# main transcription function
def transcript(to_eval, words_split, to_detect):
    if not sys.warnoptions:
        warnings.simplefilter("ignore")  # filters the warnings
    old_std = sys.stdout  # backup current stdout
    evaluation, filename = init_htr(to_eval)
    main_image_path = INPUT_IMAGE_PATH + filename
    if to_detect:
        cv2.imwrite('init_image.png', split_image_text(main_image_path, LINES_ROI, words_split, True))
        remove_irrelevant_images(LINES_ROI_PNG) if Path(LINES_ROI).is_dir() else os.mkdir(LINES_ROI)
    else:
        split_image_text(main_image_path, LINES_ROI, 150, True)
        new_text, t_count = process_data(words_split)
        delete_temp_dirs(t_count)
        sys.stdout = old_std
        if not to_eval:  # writes into a Word file the text
            doc = docx.Document()
            doc.add_paragraph(new_text)
            doc.save('text.docx')
        return evaluate(new_text, evaluation, "../evaluation input/input.txt") if to_eval else new_text
