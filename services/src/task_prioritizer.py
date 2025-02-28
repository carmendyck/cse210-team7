from datetime import datetime
from src.task_helpers import get_task_keywords

KEYWORD_PRIORITIES = {
    "test": 5,
    "quiz": 4,
    "project": 4,
    "homework": 2,
}
class TaskPrioritizer:
    def __init__(self, user_productivity=None):
        self.user_productivity = user_productivity or {}

    def calculate_priority(self, task):
        name = task["name"]
        description = task["description"]
        deadline = datetime.strptime(task["deadline"], "%Y-%m-%d")
        estimated_time = task["estimated_time"]
        days_until_deadline = (deadline - datetime.today()).days

        priority = max(10 - days_until_deadline, 1)  # Ensures a minimum priority of 1

        top_keywords = get_task_keywords(name, description)

        for keyword in top_keywords:
            if keyword in KEYWORD_PRIORITIES:
                priority += KEYWORD_PRIORITIES[keyword]

        if task["course"] in self.user_productivity:
            avg_completion_time = self.user_productivity[task["course"]]
            if estimated_time > avg_completion_time:
                priority += 2

        return min(priority, 10)

    def prioritize_tasks(self, task_list):
        for task in task_list:
            task["priority"] = self.calculate_priority(task)

        return sorted(task_list, key=lambda x: x["priority"], reverse=True)


if __name__ == "__main__":
    prioritizer = TaskPrioritizer(user_productivity={"CS101": 3})
    tasks = [
        {
            "name": "Math Homework",
            "description": "Complete exercises from chapter 3",
            "course": "CSE107",
            "deadline": "2025-03-02",
            "estimated_time": 2,
        },
        {
            "name": "Final Project",
            "description": "Work on final project for CS210",
            "course": "CS101",
            "deadline": "2025-03-05",
            "estimated_time": 5,
        },
        {
            "name": "Midterm Study",
            "description": "Prepare for CSE midterm",
            "course": "CSE",
            "deadline": "2025-03-01",
            "estimated_time": 3,
        },
    ]
    sorted_tasks = prioritizer.prioritize_tasks(tasks)
    for t in sorted_tasks:
        print(f"{t['name']} - Priority: {t['priority']}")
