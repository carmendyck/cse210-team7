import re
import requests
import os
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import auth

class Task:
    keyword_bank = ["test", "quiz", "homework", "project"]

    def __init__(self, task_id):
        # Get information from backend:
        # TODO: remove this once connected to the rest of the app
        self.task_id = task_id
        self.id_token, self.db = authenticate()
        url = f"http://localhost:5050/api/viewTask/getTask/{self.task_id}"
        headers = {
            "Authorization": f"Bearer {self.id_token}"
        }
        response = requests.get(url, headers=headers)
        task_data = response.json()["task"]
        print(f"TASK RESPONSE: {task_data}")

        self.name = task_data["name"]
        self.description = task_data["notes"]
        self.time_estimate = task_data["total_time_estimate"]
        self.course = task_data["course_id"]
        self.course_id = task_data["course_id"].split("/")[2]
        self.keywords = []

        # TODO: Replace with API once it's written
        url = f"https://firestore.googleapis.com/v1/projects/tritoncal/databases/(default)/documents/course/{self.course_id}"
        headers = {
            "Authorization": f"Bearer {self.id_token}"
        }
        response = requests.get(url, headers=headers)
        course_data = response.json()["fields"]
        print(f"COURSE RESPONSE: {course_data}")

        self.course_time_estimates = {}
        for keyword in Task.keyword_bank:
            self.course_time_estimates[keyword] = course_data[f"avg_time_{keyword}"]

# TODO: For testing -- remove once connected to frontend
def authenticate():
    # Load environment variables from the .env file
    load_dotenv(dotenv_path="../../backend/.env")
    # Get the API key
    api_key = os.getenv("FIREBASE_API_KEY")
    if not api_key:
        raise ValueError("Firebase API key not found. Check your .env file.")
    # Load service account key
    cred = credentials.Certificate("../../backend/serviceAccountKey.json")
    # Initialize app
    firebase_admin.initialize_app(cred)
    # Authentication
    custom_token = "" # check slack for line to replace this with
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={api_key}"
    data = {"token": custom_token, "returnSecureToken": True}
    response = requests.post(url, json=data)
    id_token = response.json().get("idToken")
    # Get Firestore client
    db = firestore.client()
    return id_token, db

def get_task_keywords(name, description):
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
