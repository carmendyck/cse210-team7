import importlib.util
import unittest
from hypothesis import example, given, strategies as st
from src.task_prioritizer import priority_formula
import random
import re

class TestTaskPrioritizer(unittest.TestCase):

    # formula returns a priority level given any integers for parameters
    @given(st.integers())
    def test_priority_formula(self, task_type_avg, time_estimate, days_left):
        prio = priority_formula(task_type_avg, time_estimate, days_left)
        levels = [0,1,2]
        assert prio in levels

if __name__ == "__main__":
    unittest.main()