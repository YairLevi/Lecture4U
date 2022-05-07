from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
import speech_to_text
from tinytag import TinyTag
from datetime import date

app = Flask(__name__)
CORS(app, support_credentials=True)

file_name = ""
language = ""
transcribe_confidence = 0
course_name = ''
group_name = ''
message_for_course = ''
message_for_group = ''
current_date = ''


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
    global language, transcribe_confidence, current_date
    transcribe_confidence = 0

    # Textual month, day and year
    current_date = date.today()
    current_date = current_date.strftime("%B %d, %Y")

    language = request.args.get('language')

    print("Transcribe language is: {}".format(language))
    print("-----Run speech to text-----\n")

    target_name = file_name.split('.')[0] + '.wav'
    transcribe_confidence = round(speech_to_text.run(file_name, target_name, language), 3)
    print("transcribe_confidence = {}".format(transcribe_confidence))
    docx_file_name = 'Lecture 1.docx'

    resp = send_file(docx_file_name, as_attachment=True)
    resp.headers['transcribe-file-name'] = file_name
    resp.headers['transcribe-date'] = current_date
    resp.headers['transcribe-score'] = transcribe_confidence

    return resp


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


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Expose-Headers', '*,Authorization,X-custom-header')
    # response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    # response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
