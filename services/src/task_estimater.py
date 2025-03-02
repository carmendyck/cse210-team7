from task_helpers import get_task_keywords, Task

class TaskEstimator:
    def __init__(self, task):
        self.task = task
        self.keywords = get_task_keywords(task.name, task.description)

    def estimate_time(self):
        avg_time = 0
        for keyword in self.keywords:
            avg_time += self.task.course_time_estimates[keyword]['doubleValue']
        est = avg_time / len(self.keywords)
        task_ref = self.task.db.collection('tasks').document(self.task.task_id)
        task_ref.update({
            'total_time_estimate': est
        })
        return est
    
    def update_course_time_estimates(self):
        tasks_ref = self.task.db.collection('tasks').where('course_id', '==', self.task.course)
        course_ref = self.task.db.collection('course').document(self.task.course_id)
        tasks = tasks_ref.stream()
        task_list = []
        for task in tasks:
            task_data = task.to_dict()
            task_list.append(task_data)
        avg_times = {}
        num_tasks = {}
        for kw in Task.keyword_bank:
            avg_times[kw] = 0
            num_tasks[kw] = 0
        for task in task_list:
            kws = get_task_keywords(task["name"], task["notes"])
            for kw in kws:
                avg_times[kw] += task["total_time_estimate"]
                num_tasks[kw] += 1
        for kw in Task.keyword_bank:
            if num_tasks[kw] > 0:
                avg_times[kw] /= num_tasks[kw]
            course_ref.update({
                f'avg_time_{kw}': avg_times[kw],  # Modify the task fields as needed
            })

if __name__ == "__main__":
    myTask = Task("8NxF97r7XBMJDeNIOXgl")
    est = TaskEstimator(myTask)
    est.estimate_time()
    est.update_course_time_estimates()