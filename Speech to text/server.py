from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS, cross_origin
import speech_to_text

app = Flask(__name__)
CORS(app, support_credentials=True)

file_name = ""


@app.route("/upload", methods=["POST"])
@cross_origin()
def upload():
    global file_name
    file_name = request.files['file'].filename
    print('File from the POST request is: {}\n'.format(file_name))
    return {'isUploaded': True,
            'FileName': file_name}


@app.route("/transcribe", methods=["GET"])
@cross_origin()
def transcribe():
    print("-----Run speech to text-----\n")
    transcribe_confidence = speech_to_text.run(file_name, 'zoom_record.wav', 'hebrew')
    print("transcribe_confidence = {}".format(transcribe_confidence))
    docx_file_name = 'Lecture 1.docx'
    response = make_response(send_file(docx_file_name, as_attachment=True))
    response.headers['confidence'] = transcribe_confidence
    print(response.headers)
    return response


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
