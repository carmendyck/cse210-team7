import importlib.util
import unittest
from hypothesis import example, given, strategies as st
from src.task_prioritizer import priority_formula
import random
import re

# # CONSTANTS
# task_type_map = {
#     "test": 15,
#     "quiz": 20,
#     "project": 25,
#     "homework": 30
# }
# c = 0.6
# prio0_thresh = 15
# prio1_thresh = 30

# def priority_formula(task_type_avg, time_estimate, days_left):
#     # LOWER RAW SCORE => HIGHER PRIORITY (0)
#     # HIGHER RAW SCORE => LOWER PRIORITY (1 or 2)

#     # dirty fix lol
#     if task_type_avg <= 0:
#         task_type_avg = 1
#     if time_estimate <= 0:
#         time_estimate = 1

#     raw_score =  (task_type_avg / time_estimate) * (days_left * c)
#     # ** days left will shrink over time, making the raw score smaller
#     # ** ** previously was exponent, but changed to just proportional multiplier (see note above)
#     # ** ** c = multiplier on days left for adjustments
#     # ** task type value directly proportional to raw score
#     # ** ** (exams => low value => lower raw score)
#     # ** time_estimate inversely proportional to raw score
#     # ** ** (more time needed for assignment -> lowers raw score)
#     # ** ** ENSURE THAT TIME_ESTIMATE IS NOT ZERO

#     print()
#     print(f"raw_score: (task_type_avg / time_estimate) * (days_left * c)")
#     print(f"raw_score: ({task_type_avg} / {time_estimate}) * ({days_left} * {c})")
#     print(f"raw_score: {raw_score}")

#     # update priority variable and return (should be 0-2)
#     prio = 2
#     if (raw_score < prio0_thresh):
#         prio = 0
#     elif (raw_score < prio1_thresh):
#         prio = 1
#     # else prio = 2 (default)

#     print(f"priority: {prio}")

#     return prio

class TestTaskPrioritizer(unittest.TestCase):

    # formula returns a priority level given any integers for parameters
    @given(st.integers(),st.integers(),st.integers())
    def test_priority_formula(self, task_type_avg, time_estimate, days_left):
        prio = priority_formula(task_type_avg, time_estimate, days_left)
        levels = [0,1,2]
        assert prio in levels

if __name__ == "__main__":
    unittest.main()