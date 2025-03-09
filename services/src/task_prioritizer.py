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
        ## - priority history (?)
        # - keywords (DB)

        # dynamic - values needed: <-- maybe split into separate "update" function?
        # - past student productivity (?)
        # - - maybe also if student isn't keeping on pace with the time splits, increase prio
        # - current date
        # - task deadline

        # heuristics (weighted priority + greedy scheduling)

        # update priority variable and return

        pass

