from datetime import datetime, date, timedelta
import networkx as nx
from typing import Any


MAX_HOURS_PER_DAY = 6
MAX_PRIORITY = 2

class Task:
    def __init__(self, id: str, name: str, priority: int, time_left: int, due_date: datetime.date):
        self.id: str = id                        # task ID from Firebase
        self.name: str = name                    # task name
        self.priority: int = priority            # priority level (0 = high, 2 = low)
        self.time_left: int = time_left          # estimated hours left to complete task
        self.due_date: datetime.date = due_date  # due datetime
        self.due_in_days: int = (self.due_date - date.today()).days


class TempDBTask:
    """
    Simulate a task queried from the database.
    """
    def __init__(self, id: str, name: str, priority: int, total_time_estimate: int, due_date: datetime.date, time_spent: int=0):
        self.id: str = id                        # task ID from Firebase
        self.name: str = name                    # task name
        self.priority: int = priority            # priority level (0 = high, 2 = low)
        self.total_time_estimate: int = total_time_estimate   # estimated hours left to complete task
        self.time_spent: int = time_spent        # time already worked on task
        self.due_date: str = due_date            # due datetime as an ISOstring
        self.completed: bool = False


class TaskScheduler:
    """
    Schedules tasks from app across based on priorities and deadlines.

    NOTE: Algorithn currently...
          - does not consider due TIME, only the due date.
          - only schedules in 1-hour blocks. if estimate time is float, will be truncated to nearest whole-hour.
    """
    def __init__(self, task_data):
        self.task_list: list[Task] = []  # contains all incomplete tasks (with due dates in the future)
        self.id_to_task: dict[str, Task] = {}
        print("in the schedule object")

        for task in task_data:
            due_date = date.fromisoformat(task.due_date.split("T")[0])
            if due_date > date.today() and not task.completed:
                new_task = Task(
                    id=task.id, name=task.name, priority=task.priority,
                    time_left=(task.total_time_estimate - task.time_spent),
                    due_date=due_date
                )
                self.task_list.append(new_task)
                self.id_to_task[task.id] = new_task

        # To be constructed
        self.graph: nx.classes.digraph.DiGraph = None
        self.node_index_to_task: dict[int, Task] = {}
        self.nodes_dict: dict[str, Any] = None
        self.schedule: dict[str, list[tuple[Task, int]]] = None


    def schedule_tasks(self, debug=False):
        """
        Schedules tasks based on priority levels and due dates.
        Priority first, then due dates second are considered when scheduling tasks across days.

        :param debug: If true, prints out aspects of scheduling process for debugging.
        """
        self._construct_task_schedule_graph(debug=debug)
        mincost_flow, flow_info = self._graph_to_mincost_flow(debug=debug)
        self._mincost_flow_to_schedule(mincost_flow, debug=debug)


    def store_schedule(self):
        """
        Adds schedule to "next_worktimes" collection in Tasks database, clearing old worktimes.
        """
        # TODO: implement
        pass


    def _construct_task_schedule_graph(self, debug: bool=False) -> None:
        """
        Constructs task scheduling graph based on priorities and due dates in task list.

        :param debug: If true, prints out graph, weights, and capacities for debugging.
        """
        g = nx.DiGraph()
        start_node = 1
        task_nodes = (2, 2 + len(self.task_list) - 1)  # range of indices of task nodes (inclusive)
        day_nodes = (task_nodes[1] + 1, -1)       # range of indices of day notes (inclusive)
        end_node = None

        # Add node for each task to scheduler graph
        task_node = start_node + 1
        for task in self.task_list:
            time_left = task.time_left
            priority = task.priority
            due_in_days = task.due_in_days
            self.node_index_to_task[task_node] = task

            # Connect from START -> TASK with attributes (time_left, priority)
            g.add_edges_from([(1, task_node, {"capacity": time_left, "weight": priority})])

            # Connect from TASK -> DAY with attributes (time_left, score(priority, time))
            for day in range(due_in_days):
                # how much it matters that the task is worked on earlier
                work_early_matters = int((- 8 / MAX_PRIORITY) * priority + 10)  # integer between [0, 10]
                days_prop = round((day + 1) / due_in_days, 2)  # proportion of days till due as float between [0, 1]
                priority_time_weight = (20 * priority) + int(work_early_matters * days_prop)

                # Add edge between task and day
                day_node = day_nodes[0] + day
                g.add_edges_from([(task_node, day_node, {"capacity": time_left, "weight": priority_time_weight})])
                day_nodes = (day_nodes[0], max(day_nodes[1], day_node))
            task_node += 1
        end_node = day_nodes[1] + 1

        # Connect from DAY -> END with attributes (max_days, 0)
        for day_node in range(day_nodes[0], day_nodes[1] + 1):
            g.add_edges_from([(day_node, end_node, {"capacity": MAX_HOURS_PER_DAY, "weight": 0})])

        # Print out graph for debugging
        if debug:
            print("\n= GRAPH ===================================")
            for u, v, attr in g.edges(data=True):
                print(f"Edge ({u}, {v}): {attr}")

        self.nodes_dict = {
            'start_node': start_node,
            'task_nodes': task_nodes,
            'day_nodes': day_nodes,
            'end_node': end_node
        }
        self.graph = g


    def _graph_to_mincost_flow(self, debug: bool=False) -> tuple[dict, dict]:
        """
        Using scheduler graph, gets mincost_flow to maximize tasks completed within
        due dates based on task priority levels.

        :returns:
            :mincost_flow: Dictionary mapping "from" node to dictionary.
                           Inside dictionary maps "to" node to number of hours flowing through edge.
            :flow_info: Dictionary containing cost of schedule and total hours used in schedule.
        """
        start_node = self.nodes_dict['start_node']
        end_node = self.nodes_dict['end_node']
        mincost_flow = nx.max_flow_min_cost(self.graph, start_node, end_node)

        # Check that min-cost max-flow is acheived
        min_cost = nx.cost_of_flow(self.graph, mincost_flow)
        mincost_flow_value = sum((mincost_flow[u][end_node] for u in self.graph.predecessors(end_node))) - \
          sum((mincost_flow[end_node][v] for v in self.graph.successors(end_node)))

        flow_info = {
            'min_cost': min_cost,
            'max_flow': mincost_flow_value
        }
        if debug:
            print(flow_info)
        return mincost_flow, flow_info


    def _mincost_flow_to_schedule(self, mincost_flow: dict[int, dict[int, int]], debug: bool=False) -> None:
        """
        Given mincost_flow dictionary, stores schedule of date to list of tasks and alloted time.

        :param mincost_flow: dictionary of dictionaries keyed by nodes such that
                             mincost_flow[u][v] is the flow of edge(u, v).
        """
        task_nodes = self.nodes_dict['task_nodes']
        day_nodes = self.nodes_dict['day_nodes']

        schedule_dict = {}
        for task_node in range(task_nodes[0], task_nodes[1] + 1):
            task_split = mincost_flow[task_node]
            for day_node, hours in task_split.items():
                day = (date.today() + timedelta(days=(day_node - day_nodes[0] + 1))).isoformat()
                if (hours > 0):
                    if day not in schedule_dict:
                        schedule_dict[day] = []
                    task = self.node_index_to_task[task_node]
                    schedule_dict[day].append((task, hours))  # TODO: translate day into isoformat

        self.schedule = dict(sorted(schedule_dict.items()))
        if debug:
            self._print_schedule()
            self._schedule_evaluator()


    def _print_schedule(self):
        print("\n= SCHEDULE ================================")
        for day in self.schedule:
            print(f'Day {day}:')
            for item in self.schedule[day]:
                print(f' - {item[0].name} ({item[1]} hours)')


    def _schedule_evaluator(self) -> dict:
        task_status = {}
        due_date = {}
        for task in self.task_list:
            task_status[task.id] = {
                'name': task.name,
                'time_left': task.time_left,
                'days_early': 0,
                'completed': False
            }
            due_date[task.id] = task.due_date

        for day in self.schedule:
            for item in self.schedule[day]:
                task, worktime = item
                task_status[task.id]['time_left'] -= worktime
                if task_status[task.id]['time_left'] == 0:
                    task_status[task.id]['days_early'] = (due_date[task.id] - date.fromisoformat(day)).days
                    task_status[task.id]['completed'] = True

        print("\n= SCHEDULE EVALUATION =====================")
        for task_id in task_status:
            task = task_status[task_id]
            print(task['name'])
            print(f" > Time left: {task['time_left']}, Days early: {task['days_early']}, Completed: {task['completed']}")

        return task_status


if __name__ == "__main__":
    task_list = [
        TempDBTask(id='1', name='English paper',            priority=0, total_time_estimate=12, due_date=(date.today() + timedelta(days=5)).isoformat()),
        TempDBTask(id='2', name='Study for math quiz',      priority=0, total_time_estimate=4,  due_date=(date.today() + timedelta(days=3)).isoformat()),
        TempDBTask(id='3', name='ML clustering assignment', priority=1, total_time_estimate=5,  due_date=(date.today() + timedelta(days=2)).isoformat()),
        TempDBTask(id='4', name='Read 5 chapters of TSONM', priority=2, total_time_estimate=7,  due_date=(date.today() + timedelta(days=3)).isoformat())
    ]

    scheduler = TaskScheduler(task_list)
    scheduler.schedule_tasks(debug=True)
