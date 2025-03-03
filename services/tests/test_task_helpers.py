import importlib.util
import unittest
from hypothesis import example, given, strategies as st
from src.task_helpers import get_task_keywords
import random
import re

class TestTaskHelpers(unittest.TestCase):

    # Test cases:
    # none
    @given(st.text())
    def test_no_text(self, test_str):
        keyword_bank = ["test", "quiz", "homework", "project"]
        if any(keyword in test_str for keyword in keyword_bank):
            return
        else:
            top_keywords = get_task_keywords(test_str, test_str)
            assert top_keywords == []

    # one word, stay within length allowed
    @given(st.integers(min_value=1, max_value=400))
    def test_in_order_unique(self, num_instances):
        test_str = "test"
        test_name = (test_str + " ") * num_instances
        test_descr = (test_str + " ") * num_instances
        top_keywords = get_task_keywords(test_name, test_descr)
        assert top_keywords == [test_str]

    # single word, stay within length allowed
    @given(st.lists(st.integers(min_value=1, max_value=800), min_size=4, max_size=4, unique=True))
    def test_get_top_keywords(self, num_instances):

        keyword_bank = ["test", "quiz", "homework", "project"]
        max_value = max(num_instances)
        top_word = keyword_bank[num_instances.index(max_value)]

        keyword_list = []
        for i, keyword in enumerate(keyword_bank):
            for _ in range(num_instances[i]):
                keyword_list.append(keyword + " ")

        random.shuffle(keyword_list)
        test_str = ""
        for word in keyword_list:
            test_str += word
        test_str = test_str[0:-1]
        top_keywords = get_task_keywords(test_str, test_str)
        assert top_keywords == [top_word]


    # multiple of the same word, stay within length allowed
    @given(st.lists(st.integers(min_value=1, max_value=800), min_size=4, max_size=4, unique=False))
    def test_get_multiple_top_keywords(self, num_instances):
        keyword_bank = ["test", "quiz", "homework", "project"]
        max_value = max(num_instances)

        def find_all_occurrences(list_data, element):
            indices = []
            for index, value in enumerate(list_data):
                if value == element:
                    indices.append(index)
            return indices
        
        top_word_idxs = find_all_occurrences(num_instances, max_value)

        keyword_list = []
        for i, keyword in enumerate(keyword_bank):
            for _ in range(num_instances[i]):
                keyword_list.append(keyword + " ")

        random.shuffle(keyword_list)
        test_str = ""
        for word in keyword_list:
            test_str += word
        test_str = test_str[0:-1]
        top_keywords = get_task_keywords(test_str, test_str)
        for idx in top_word_idxs:
            assert keyword_bank[idx] in top_keywords

if __name__ == "__main__":
    unittest.main()
