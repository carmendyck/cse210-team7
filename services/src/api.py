from flask import Flask, jsonify, request
from flask_cors import CORS
from task_prioritizer import TaskPrioritizer
from task_helpers import Task

app = Flask(__name__)
CORS(app)

@app.route("/api/task-priority/<task_id>", methods=["GET"])
def get_task_priority(task_id):
    try:
        task = Task(task_id)
        prioritizer = TaskPrioritizer(task)
        priority = prioritizer.get_task_priority()

        return jsonify({"task_id": task_id, "priority": priority}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051, debug=True)
