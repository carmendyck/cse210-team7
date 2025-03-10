import re
import requests
import os
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import auth
from fastapi import FastAPI, Header, HTTPException

class Task:
    keyword_bank = ["test", "quiz", "homework", "project", "reading"]

    def __init__(self, task_data, id_token, db):

        self.name = task_data["name"]
        self.description = task_data["notes"]
        self.time_estimate = task_data["total_time_estimate"]
        self.course = task_data["course_id"]
        self.course_id = task_data["course_id"].split("/")[1]
        self.keywords = []
        self.id_token = id_token
        self.db = db
        self.task_id = task_data["id"]

    def add_course_info(self, course_data):
        self.course_time_estimates = {}
        for keyword in Task.keyword_bank:
            self.course_time_estimates[keyword] = course_data[f"avg_time_{keyword}"]

def get_task_keywords(name, description, task=None):
    if name is None:
        name = ""
    if description is None:
        description = ""
    name = name.lower()
    description = description.lower()
    
    top_keywords = []
    max_count = 1

    for keyword in Task.keyword_bank:
        # Build regex pattern dynamically without look-behind
        pattern = rf'\b{re.escape(keyword)}\b'

        keyword_count = len(re.findall(pattern, name)) + len(re.findall(pattern, description))

        if keyword_count == max_count:
            top_keywords.append(keyword)
        elif keyword_count > max_count:
            top_keywords = [keyword]
            max_count = keyword_count  # Update max count
    
    return top_keywords

# TESTING:
if __name__ == "__main__":
    myTask = Task("8NxF97r7XBMJDeNIOXgl")
