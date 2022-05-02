import glob
from htr import htr
import os
from evaluate import evaluate
import docx
from pathlib import Path
import cv2
import sys
import warnings


LINES_ROI = "..\\ROIS"
WORDS_ROI = "..\\ROIw"
LINES_ROI_PNG = LINES_ROI + "\\*.png"
WORDS_ROI_PNG = WORDS_ROI + "\\*.png"


# filters the warnings
def ignore_warnings():
    if not sys.warnoptions:
        warnings.simplefilter("ignore")
    old_stdout = sys.stdout  # backup current stdout
    sys.stdout = open("errors.txt", "w")
    return old_stdout


# creates new images from a given image (text --> lines; lines --> words) into ROIs\ROIw folders
def split_image_text(image_name, target_dir, kernel_size, is_line):
    img = cv2.imread(image_name, 1)
    # finds the optimal threshold to the image, which is called Otsu threshold (optimal k-means for back & foreground).
    # for more information on Otsu binarization: https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html
    r, t = cv2.threshold(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    # finds an operation which will form a region along the horizontal axis.
    # chooses a kernel which: width > height --> choosing the right kernel (according user's choice)
    dilation = cv2.dilate(t, cv2.getStructuringElement(shape=cv2.MORPH_RECT, ksize=(kernel_size, 1)), iterations=1)
    # bounds the contours and iterates through them. extracts the ROI using Numpy (slices)
    contours, hierarchy = cv2.findContours(dilation, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    copied = img.copy()
    idx = len(contours)
    height_threshold = width_threshold = 10
    if not is_line:
        my_list = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            ROI = img[y:y + h, x:x + w]
            # checks whether the size of the ROI is too small --> indicates there is no additional text in the rectangle
            threshold_smaller = ROI.shape[0] < height_threshold or ROI.shape[1] < width_threshold
            if threshold_smaller or ((ROI.shape[0] < 2 * height_threshold) and (ROI.shape[1] < 2 * width_threshold)):
                continue
            my_list.append((x, y, w, h))
        my_list.sort(key=lambda z: z[0])
    else:
        my_list = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            ROI = img[y:y + h, x:x + w]
            # checks whether the size of the ROI is too small --> indicates there is no additional text in the rectangle
            threshold_smaller = ROI.shape[0] < height_threshold or ROI.shape[1] < width_threshold
            if threshold_smaller or ((ROI.shape[0] < 2 * height_threshold) and (ROI.shape[1] < 2 * width_threshold)):
                continue
            my_list.append((x, y, w, h))
    for i, c in enumerate(my_list):
        x, y, w, h = c[0], c[1], c[2], c[3]
        ROI = img[y:y + h, x:x + w]
        cv2.rectangle(copied, (x, y), (x + w, y + h), (36, 255, 12), 2)
        idx -= 1
        # converts the image to black and white
        r, t = cv2.threshold(cv2.cvtColor(ROI, cv2.COLOR_BGR2GRAY), 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
        if is_line:
            cv2.imwrite(target_dir + '\\ROI_{:02d}.png'.format(idx), 255 - cv2.cvtColor(t, cv2.COLOR_BGR2RGB))
        else:
            cv2.imwrite(target_dir + '\\ROI_{:04d}.png'.format(x), 255 - cv2.cvtColor(t, cv2.COLOR_BGR2RGB))
    return cv2.cvtColor(copied, cv2.COLOR_BGR2RGB)


# creates an empty evaluation file or deletes the existing evaluation file
def init_eval(evaluation, to_eval):
    if to_eval:
        open(evaluation, "w").close()
    elif Path(evaluation).is_file():
        os.remove(evaluation)


# creates empty folders for the ROI's
def temp_folders():
    remove_irrelevant_images(LINES_ROI_PNG) if Path(LINES_ROI).is_dir() else os.mkdir(LINES_ROI)
    remove_irrelevant_images(WORDS_ROI_PNG) if Path(WORDS_ROI).is_dir() else os.mkdir(WORDS_ROI)


# initializes the input files
def init_htr(to_eval, text):
    evaluation = "evaluation.txt"
    open(text, "w+").close()
    init_eval(evaluation, to_eval)
    temp_folders()
    fn = open("filename.txt", "r+")
    filename = fn.read()
    fn.close()
    return evaluation, filename


# writes into a Word file the text
def write_to_word(text):
    t = open(text, "r+")
    text_data = t.read()
    t.close()
    doc = docx.Document()
    doc.add_paragraph(text_data)
    doc.save('text.docx')
    return text_data


# removes the temporary images
def remove_irrelevant_images(p):
    for img in glob.glob(p):
        os.remove(img)


# for each line, it parses the image into words and transcripts it into words and writes to the file
def handle_htr(text, words_split_const):
    lines, l_idx = glob.glob(LINES_ROI_PNG), 0
    for img in lines:
        split_image_text(img, WORDS_ROI, words_split_const, False)
        current_line = glob.glob(WORDS_ROI_PNG)
        for img in current_line:
            htr(img, text)
        if len(lines) > 1:
            out_text = open(text, "a+")  # adds new line (\n) to the end of the line
            out_text.write("\n")
            out_text.close()
        l_idx += 1
        remove_irrelevant_images(WORDS_ROI_PNG)
    remove_irrelevant_images(LINES_ROI_PNG)


# main transcription function
def transcript(to_eval, text, words_split_const, to_detect):
    old_std = ignore_warnings()
    evaluation, filename = init_htr(to_eval, text)
    if to_detect:
        cv2.imwrite('init_image.png', split_image_text("..\\image examples\\" + filename, LINES_ROI, words_split_const, True))
        temp_folders()
    else:
        split_image_text("..\\image examples\\" + filename, LINES_ROI, 150, True)
        handle_htr(text, words_split_const)
        sys.stdout = old_std
        data = write_to_word(text)
        return evaluate(text, evaluation, "..\\evaluation input\\input.txt") if to_eval else data
