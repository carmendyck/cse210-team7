from task_helpers import get_task_keywords, Task
from datetime import date, datetime


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

    """
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
    """

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
        task_type_map = {"test": 15, "quiz": 20, "project": 25, "homework": 30}
        c = 0.6
        prio0_thresh = 15
        prio1_thresh = 30

        print()
        print(f"constants:")
        print(f"task_type_map: {task_type_map}")
        print(f"c: {c}")
        print(f"prio0_thresh: {prio0_thresh}")
        print(f"prio1_thresh: {prio1_thresh}")

        # not sure if instead of the arbitrary type values, we should use
        # the avg time_estimate from courses; but then that and time_estimate
        # is basically the same, assuming TaskEstimator was already run

        # task_type_avg = sum([task_type_map[k] for k in self.keywords]) / max(
        #     len(self.keywords), 1
        # )
        task_type_avg = 1

        # ✅ Improved Fix for `time_estimate` (ensures valid float > 0)
        time_estimate = (
            float(self.task.time_estimate)
            if self.task.time_estimate and float(self.task.time_estimate) > 0
            else 1
        )
        print(f"time_estimate value: {self.task.time_estimate}")
        print(f"Converted time_estimate value for calculation: {time_estimate}")

        # reference string: "2025-03-15T07:59:00.000Z"
        due_datetime_string = self.task.due_datetime
        due_date_string = due_datetime_string.split("T")[
            0
        ]  # gets the date part of string
        deadline = datetime.strptime(due_date_string, "%Y-%m-%d").date()
        current_day = date.today()
        delta = deadline - current_day
        days_left = max(delta.days, 2)

        print(f"current_day: {current_day}")
        print(f"deadline: {deadline}")
        print(f"days_left: {days_left}")
        # *should* be ok if it goes into negatives? i.e. if a thing is past due,
        # the exponent will be negative, making the raw_score extremely small and make the priority
        # high (0)

        # i forgot that an exponent would make fractions smaller, so a
        # test with a high time estimate but is many days away will actually return a very
        # high priority when it should really be not that high

        # LOWER RAW SCORE => HIGHER PRIORITY (0)
        # HIGHER RAW SCORE => LOWER PRIORITY (1 or 2)
        raw_score = (task_type_avg / time_estimate) * (days_left * c)
        # ** days left will shrink over time, making the raw score smaller
        # ** ** previously was exponent, but changed to just proportional multiplier (see note above)
        # ** ** c = multiplier on days left for adjustments
        # ** task type value directly proportional to raw score
        # ** ** (exams => low value => lower raw score)
        # ** time_estimate inversely proportional to raw score
        # ** ** (more time needed for assignment -> lowers raw score)
        # ** ** ENSURE THAT TIME_ESTIMATE IS NOT ZERO

        print()
        print(f"raw_score: (task_type_avg / time_estimate) * (days_left * c)")
        print(f"raw_score: ({task_type_avg} / {time_estimate}) * ({days_left} * {c})")
        print(f"raw_score: {raw_score}")

        # update priority variable and return (should be 0-2)
        prio = 2
        if raw_score < prio0_thresh:
            prio = 0
        elif raw_score < prio1_thresh:
            prio = 1
        # else prio = 2 (default)

        print(f"priority: {prio}")

        self.priority = prio

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
