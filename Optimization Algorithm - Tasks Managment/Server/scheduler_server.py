import json
from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS, cross_origin
import Scheduler

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route("/calendar_task_data", methods=["POST"])
@cross_origin()
def calendar_task_data():
    scheduler_data = {}
    data = json.loads(request.data)
    for dic in data:
        start_time = dic["start"]
        end_time = dic["end"]
        day = dic["day"]
        priority = dic["priority"]
        task_name = dic["task_name"]
        start_date = dic["start_date"]
        end_date = dic["end_date"]

        keys = scheduler_data.keys()
        if task_name not in keys:
            scheduler_data[task_name] = {
                'priority': priority,
                'domains': [{
                    'start': start_time,
                    'end': end_time,
                    'day': day,
                    'start_date': start_date,
                    'end_date': end_date
                }]
            }
        else:
            domains_list = scheduler_data[task_name]['domains']
            domains_list.append({
                'start': start_time,
                'end': end_time,
                'day': day,
                'start_date': start_date,
                'end_date': end_date
            })

    print("\n------Start Scheduler------\n")
    results = Scheduler.main(scheduler_data)
    print("\n------Scheduler Results------\n")
    print(results)

    return results


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
