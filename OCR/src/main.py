import glob
import split_text_to_lines
import htr
import os
from evaluate import evaluate
import docx
from pathlib import Path

SCRIPT_PATH = '..\\OCR\\src\\'

to_eval = True

LINES_ROI = "..\\ROIS"
WORDS_ROI = "..\\ROIw"
LINES_ROI_PNG = LINES_ROI + "\\*.png"
WORDS_ROI_PNG = WORDS_ROI + "\\*.png"


def new_line(text_file):
    out_text = open(text_file, "a+")
    out_text.write("\n")
    out_text.close()


def init_out_files(r, t):
    f = open(t, "w+")
    f.close()


def init_eval(evaluation):
    if to_eval:
        f = open(evaluation, "w")
        f.close()
    elif Path("evaluation.txt").is_file():
        os.remove(evaluation)


def init_ocr_htr():
    results, text, evaluation = "results.txt", "text.txt", "evaluation.txt"
    init_out_files(results, text)
    init_eval(evaluation)
    remove_irrelevant_images(LINES_ROI_PNG)
    remove_irrelevant_images(WORDS_ROI_PNG)
    fn = open("filename.txt", "r+")
    filename = fn.read()
    fn.close()
    return results, text, evaluation, filename


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


def handle_line(current, results, text):
    for img in current:
        htr.main(img, results, text)


def handle_htr(results, text):
    lines = glob.glob(LINES_ROI_PNG)                                # 59
    l_idx = 0                                          # 18: 58 -> 0.48, 59 -> 0.74, 60 -> 0.48, 61 -> 0.48, 62 -> 0.48
    for img in lines:                                  # 17: 58 -> 0.43, 59 -> 0.43, 60 -> 0.43, 61 -> 0.49, 62 -> 0.43
        split_text_to_lines.main(img, WORDS_ROI, 45)   # 14: 58 -> 0.48, 59 -> 0.50, 60 -> 0.48, 61 -> 0.53, 62 -> 0.39
        current_line = glob.glob(WORDS_ROI_PNG)        # 16: 58 -> 0.74, 59 -> 0.74, 60 -> 0.74, 61 -> 0.54, 62 -> 0.54
        if (l_idx != (len(lines) - 1)) or len(lines) == 1:
            handle_line(current_line, results, text)
            new_line(text)
            l_idx += 1
        else:
            handle_line(current_line[::-1], results, text)
        remove_irrelevant_images(WORDS_ROI_PNG)


if __name__ == '__main__':
    os.chdir(SCRIPT_PATH)
    results, text, evaluation, filename = init_ocr_htr()
    split_text_to_lines.main("..\\image examples\\" + filename, LINES_ROI, 150)
    handle_htr(results, text)
    if to_eval:
        evaluate(text, evaluation, "input.txt")
    text_data = write_to_word(text)

