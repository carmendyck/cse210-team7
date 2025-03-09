from task_helpers import get_task_keywords, Task

class TaskPrioritizer:
    def __init__(self, task):
        self.task = task
        self.keywords = get_task_keywords(task.name, task.description)
        # default priority - for now based on what get_task_priority had initially,
        # but could be changed to some other value or call assign_task_priority here
        self.priority = 2

    def get_task_priority(self):
        # return 2
        self.assign_task_priority()
        return self.priority

    '''
    Requirements -- The prioritization algorithm shall use:
    - tradeoff between time left (to complete task) and deadline
    - priority history
    - keywords (test, project, final, midterm, assignment, etc.)

    Dynamic adjustments -- update priorities based on: 
    - past student productivity - (if tasks generally take longer or shorter than expected) – this may be rolled in with task estimation
    - time until deadline - implement urgent decay (priorities increase as deadlines approach)

    Other implementation notes (for version 1)
    - Assign higher priority based on the type of work. (tests have higher priority than HWs?)
    - Closer to the deadline, higher the priority?
    - Starting with heuristics (weighted priority + greedy scheduling).
    '''
    def assign_task_priority(self):
        
        # initial - values needed:
        # - task time estimate (DB)
        # - task deadline (DB)
        # - keywords (DB)

        # main idea: calculate raw score, then assign priority based on what range it falls into

        # task_type = number based on task type (test = lower value)
        # task time estimate (higher number = need more time to finish)
        # ----------> should this factor in how much time student already spent?
        # ----------> so time_estimate - time_spent = time_left, and we use time_left?
        # days left = deadline - current day


        # ---------- assumes these general importance levels for task types
        
        # CONSTANTS
        task_type_map = {
            "test": 1,
            "quiz": 2,
            "project": 3,
            "homework": 4
        }
        c = 0.4
        prio0_thresh = 15
        prio1_thresh = 30

        # not sure if instead of the arbitrary type values, we should use
        # the avg time_estimate; but then that and time_estimate is basically the same,
        # assuming TaskEstimator was already run

        task_type_avg = sum([task_type_map[k] for k in self.keywords]) / len(self.keywords)
        time_estimate = self.task.time_estimate
        # *********[[[[TODO]]]]************
        deadline = 5
        current_day = 2
        days_left = deadline - current_day

        # LOWER RAW SCORE => HIGHER PRIORITY (0)
        # HIGHER RAW SCORE => LOWER PRIORITY (1 or 2)
        raw_score =  (task_type_avg / time_estimate) ^ (days_left * c)
        # ** days left will shrink over time, making the raw score smaller
        # ** ** c = multiplier on days left for adjustments
        # ** task type value directly proportional to raw score
        # ** ** (exams => low value => lower raw score)
        # ** time_estimate inversely proportional to raw score
        # ** ** (more time needed for assignment -> lowers raw score)
        # ** ** ENSURE THAT TIME_ESTIMATE IS NOT ZERO

        # update priority variable and return (should be 0-2)
        prio = 2
        if (raw_score < prio0_thresh):
            prio = 0
        elif (raw_score < prio1_thresh):
            prio = 1
        # else prio = 2 (default)

        return prio


    # maybe not necessary if assign_priority is just recalled - pretty much the
    # same effect I guess since we're just using days til deadline and not priority history
    def update_task_priority(self):
        # dynamic - values needed: <-- maybe split into separate "update" function?
        # - current date
        # - task deadline

        # heuristics (weighted priority + greedy scheduling)

        # update priority variable and return

        pass

# Testing:
if __name__ == "__main__":
    myTask = Task("8NxF97r7XBMJDeNIOXgl")
    prioritizer = TaskPrioritizer(myTask)
    prio = prioritizer.get_task_priority()
    print(prio)
