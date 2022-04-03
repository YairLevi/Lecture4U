import glob
from htr import htr
import os
from evaluate import evaluate
import docx
from pathlib import Path
import cv2


LINES_ROI = "..\\ROIS"
WORDS_ROI = "..\\ROIw"
LINES_ROI_PNG = LINES_ROI + "\\*.png"
WORDS_ROI_PNG = WORDS_ROI + "\\*.png"


def split_text_to_lines(image_name, target_dir, kernel_size):
    img = cv2.imread(image_name, 1)
    # finds the optimum threshold to the image, which is called Otsu threshold (optimal k-means for back & foreground).
    # for more information on Otsu binarization: https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html
    ret, thresh = cv2.threshold(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    # finds an operation that will form a region along the horizontal axis.
    # chooses a kernel which is larger in width than its height --> choosing the right kernel (according user's choice)
    dilation = cv2.dilate(thresh, cv2.getStructuringElement(shape=cv2.MORPH_RECT, ksize=(kernel_size, 1)), iterations=1)
    # bounds the resulting contours and iterates through them. extracts ROI using Numpy (slices)
    contours, hierarchy = cv2.findContours(dilation, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    copied = img.copy()
    idx = len(contours)
    height_threshold = width_threshold = 10
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        ROI = img[y:y + h, x:x + w]
        # checks whether the size of the ROI is too small --> indicates there is no additional text in the rectangle
        if ROI.shape[0] < height_threshold or ROI.shape[1] < width_threshold or \
           ((ROI.shape[0] < 2 * height_threshold) and (ROI.shape[1] < 2 * width_threshold)):
            continue
        cv2.rectangle(copied, (x, y), (x + w, y + h), (36, 255, 12), 2)
        idx -= 1
        # converts the image to black and white:
        bw_col = cv2.cvtColor(ROI, cv2.COLOR_BGR2GRAY)
        ret, thresh = cv2.threshold(bw_col, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
        color = cv2.cvtColor(thresh, cv2.COLOR_BGR2RGB)
        cv2.imwrite(target_dir + '\\ROI_{:02d}.png'.format(idx), 255 - color)


def init_eval(evaluation, to_eval):
    if to_eval:
        open(evaluation, "w").close()
    elif Path(evaluation).is_file():
        os.remove(evaluation)


def init_htr(to_eval):
    text, evaluation = "text.txt", "evaluation.txt"
    open(text, "w+").close()
    init_eval(evaluation, to_eval)
    remove_irrelevant_images(LINES_ROI_PNG)
    remove_irrelevant_images(WORDS_ROI_PNG)
    fn = open("filename.txt", "r+")
    filename = fn.read()
    fn.close()
    return text, evaluation, filename


def write_to_word(text):
    t = open(text, "r+")
    text_data = t.read()
    t.close()
    doc = docx.Document()
    doc.add_paragraph(text_data)
    doc.save('text.docx')
    os.remove(text)
    return text_data


def remove_irrelevant_images(p):
    for img in glob.glob(p):
        os.remove(img)


def new_line(text):
    out_text = open(text, "a+")
    out_text.write("\n")
    out_text.close()


def handle_htr(text):
    lines = glob.glob(LINES_ROI_PNG)                                            # 59
    l_idx = 0                                          # 18: 58 -> 0.48, 59 -> 0.74, 60 -> 0.48, 61 -> 0.48, 62 -> 0.48
    for img in lines:                                  # 17: 58 -> 0.43, 59 -> 0.43, 60 -> 0.43, 61 -> 0.49, 62 -> 0.43
        split_text_to_lines(img, WORDS_ROI, 45)         # 14: 58 -> 0.48, 59 -> 0.50, 60 -> 0.48, 61 -> 0.53, 62 -> 0.39
        current_line = glob.glob(WORDS_ROI_PNG)        # 16: 58 -> 0.74, 59 -> 0.74, 60 -> 0.74, 61 -> 0.54, 62 -> 0.54
        if (l_idx != (len(lines) - 1)) or len(lines) == 1:
            for img in current_line:
                htr(img, text)
            new_line(text)
            l_idx += 1
        else:
            for img in current_line[::-1]:
                htr(img, text)
        remove_irrelevant_images(WORDS_ROI_PNG)


def transcript(to_eval):
    text, evaluation, filename = init_htr(to_eval)
    split_text_to_lines("..\\image examples\\" + filename, LINES_ROI, 150)
    handle_htr(text)
    if to_eval:
        evaluate(text, evaluation, "input.txt")
    return write_to_word(text)
