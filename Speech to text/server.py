from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS, cross_origin
import speech_to_text
from tinytag import TinyTag

app = Flask(__name__)
CORS(app, support_credentials=True)

file_name = ""
language = ""
transcribe_confidence = 0
course_name = ''
group_name = ''
message_for_course = ''
message_for_group = ''


@app.route("/upload", methods=["POST"])
@cross_origin()
def upload():
    global file_name

    file = request.files['file']
    file_name = file.filename
    file.save(file_name)

    print('File from the POST request is: {}\n'.format(file_name))

    tag = TinyTag.get(file_name)
    print('It is %f seconds long.' % round(tag.duration))

    return {'isUploaded': True,
            'FileName': file_name, 'duration': round(tag.duration)}


@app.route("/transcribe", methods=["GET"])
@cross_origin()
def transcribe():
    global language, transcribe_confidence
    language = request.args.get('language')
    transcribe_confidence = 0
    print("Transcribe language is: {}".format(language))
    print("-----Run speech to text-----\n")
    transcribe_confidence = speech_to_text.run(file_name, 'zoom_record.wav', 'hebrew')
    print("transcribe_confidence = {}".format(transcribe_confidence))
    docx_file_name = 'Lecture 1.docx'
    return send_file(docx_file_name, as_attachment=True)


@app.route("/transcribe_score", methods=["GET"])
@cross_origin()
def transcribe_score():
    print("Get request in order get transcribe_score")
    return {'transcribe_score': transcribe_confidence}


@app.route("/update_repository", methods=["POST"])
@cross_origin()
def update_repository():
    global course_name, group_name, message_for_course, message_for_group
    print(request.data)
    course_name = request.json["course_name"]["value"]
    group_name = request.json["group_name"]["value"]
    message_for_course = request.json["description"]
    message_for_group = request.json["message"]

    print("message_for_course = {}\nmessage_for_group = {}\ncourse_name = {}\ngroup_name = {}\n"
          .format(message_for_course, message_for_group, course_name, group_name))
    return "****** update_repository Successfully ******"


@app.route("/download", methods=["GET"])
@cross_origin()
def download():
    print("Get request in order to download the file")
    return "****** Send Transcribed File Successfully ******"


# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#     response.headers.add('Access-Control-Allow-Credentials', 'true')
#     return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)