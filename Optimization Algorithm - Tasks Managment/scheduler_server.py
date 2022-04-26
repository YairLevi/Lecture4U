import json
from flask import Flask, request
from flask_cors import CORS, cross_origin
import Scheduler

app = Flask(__name__)
CORS(app, support_credentials=True)

scheduling_tasks_data = {}


@app.route("/save_task_scheduling", methods=["POST"])
@cross_origin()
def save_task_scheduling():
    global scheduling_tasks_data
    scheduling_tasks_data = json.loads(request.data)
    print(scheduling_tasks_data)
    return "****** Send scheduling_tasks_data Successfully ******"


@app.route("/calendar_task_data", methods=["POST"])
@cross_origin()
def calendar_task_data():
    scheduler_data = {}
    data = json.loads(request.data)
    for dic in data:
        start_time = dic["start"]
        end_time = dic["end"]
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
                    'start_date': start_date,
                    'end_date': end_date
                }]
            }
        else:
            domains_list = scheduler_data[task_name]['domains']
            domains_list.append({
                'start': start_time,
                'end': end_time,
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