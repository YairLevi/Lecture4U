from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS, cross_origin
import transcription_model
import os
from pathlib import Path

import cv2

app = Flask(__name__)
CORS(app, support_credentials=True)

file_name = ""
language = ""
transcript_confidence = 0
course_name = ''
group_name = ''
message_for_course = ''
message_for_group = ''

CONST_SPLIT = 45  # default value

words_split_const = CONST_SPLIT


def save_fn(file, filename, path):
    os.chdir("..\\" + path)
    file.save(filename)
    os.chdir("..\\src")


@app.route("/upload", methods=["POST"])
@cross_origin()
def upload():
    global file_name
    file = request.files['file']
    file_name = file.filename
    save_fn(file, file_name, "image examples")
    f = open("filename.txt", "w")
    f.write(file_name)
    f.close()
    return {'isUploaded': True, 'FileName': file_name}


@app.route("/transcript_download", methods=["GET"])
@cross_origin()
def transcript():
    global words_split_const
    txt = "text.txt"
    transcription_model.transcript(False, txt, words_split_const, False)
    os.remove(txt)
    return send_file('text.docx', as_attachment=True)


@app.route("/change_focus", methods=["POST"])
@cross_origin()
def change_focus():
    global words_split_const
    words_split_const = int(CONST_SPLIT * int(request.values['value']) / 100)
    return {'isUploaded': True, 'newValue': str(words_split_const)}


def save_eval(text):
    f = open("input.txt", "w")
    f.write(text)
    f.close()


@app.route("/upload_txt", methods=["POST"])
@cross_origin()
def upload_txt():
    text = request.files['file']
    save_fn(text, "input.txt", "evaluation input")
    return {'isUploaded': True, 'FileName': text.filename}


@app.route("/check_detection", methods=["GET"])
@cross_origin()
def check_detection():
    global words_split_const
    txt = "text.txt"
    transcription_model.transcript(False, txt, words_split_const, True)
    os.remove(txt)
    return send_file('init_image.png', as_attachment=True)


def get_content(txt):
    f = open(txt, "r+")
    content = f.read()
    f.close()
    return content


@app.route("/init_transcript", methods=["GET"])
@cross_origin()
def init_transcript():
    global language, transcript_confidence, file_name, words_split_const
    transcript_confidence = 0
    txt = "text.txt"
    transcript_confidence = transcription_model.transcript(True, txt, words_split_const, False)
    content = get_content(txt)
    os.remove(txt)
    return {'transcript_score': transcript_confidence, 'content': content}


# @app.route("/update_repository", methods=["POST"])
# @cross_origin()
# def update_repository():
#     global course_name, group_name, message_for_course, message_for_group
#     print(request.data)
#     course_name = request.json["course_name"]["value"]
#     group_name = request.json["group_name"]["value"]
#     message_for_course = request.json["description"]
#     message_for_group = request.json["message"]
#     print("message_for_course = {}\nmessage_for_group = {}\ncourse_name = {}\ngroup_name = {}\n"
#           .format(message_for_course, message_for_group, course_name, group_name))
#     return "****** update_repository Successfully ******"
#
#
# @app.route("/download", methods=["GET"])
# @cross_origin()
# def download():
#     print("Get request in order to download the file")
#     return "****** Send Transcription Successfully ******"
#
#
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#     response.headers.add('Access-Control-Allow-Credentials', 'true')
#     return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)