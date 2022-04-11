import json
from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS, cross_origin
import Scheduler

app = Flask(__name__)
CORS(app, support_credentials=True)

scheduler_data = {}


@app.route("/calendar_task_data", methods=["POST"])
@cross_origin()
def calendar_task_data():
    data = json.loads(request.data)
    for dic in data:
        start_time = dic["start"]
        end_time = dic["end"]
        day = dic["day"]
        priority = dic["priority"]
        task_name = dic["task_name"]
        print("start_time = {}\nend_time = {}\nday = {}\npriority = {}\ntask_name = {}\n".
              format(start_time, end_time, day, priority, task_name))

    return "****** calendar_task_data Successfully ******"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
