from fastapi import FastAPI, Header, HTTPException
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import auth, credentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from task_estimater import TaskEstimator
from task_scheduler import TaskScheduler
from task_helpers import Task
import json

# Initialize Firebase Admin SDK
cred = credentials.Certificate("../../backend/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers, including Authorization
)

@app.get("/")
async def root():
    return {"message": "Python backend turned on"}

@app.get('/init-task-estimate/{task_id}')
async def get_task_estimate(task_id: str, authorization: str = Header(None)):
    print('getting task')
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split("Bearer ")[1]
    id_token = auth.verify_id_token(token)
    db = firestore.client()

    print(f"{task_id=}")

    # Get information from backend:
    url = f"http://localhost:5050/api/viewTask/getTask/{task_id}"
    headers = {
        "Authorization": f"Bearer {id_token}"
    }
    response = requests.get(url, headers=headers)
    print("printing response: ")
    print(response)
    print(response.json())
    task_data = response.json()["task"]
    print(f"TASK RESPONSE: {task_data}")
    task = Task(task_data, id_token, db)

    try:
        url = f"http://localhost:5050/api/courseSelect/getCourse/{task.course_id}"
        headers = {
            "Authorization": f"Bearer {id_token}"
        }
        response = requests.get(url, headers=headers)
        print("printing response: ")
        print(response)
        print(response.json())
        task.add_course_info(response.json()["course"])
    except:
        print("No course information available...")
        print("Prepopulating...")
        task.course_time_estimates = {}
        for keyword in Task.keyword_bank:
            task.course_time_estimates[keyword] = 2

    est = TaskEstimator(task)
    print(est.estimate_time())
    return JSONResponse(content=task_data)


@app.get('/auto-schedule/{uid}')
async def get_tasks_schedule(uid: str, authorization: str = Header(None)):
    print(f'generating schedule for user: {uid}')
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split("Bearer ")[1]
    id_token = auth.verify_id_token(token)
    db = firestore.client()

    print(f"{uid=}")

    # Get all user tasks from backend
    try:
        url = f"http://localhost:5050/api/tasklist/getAllTasks/{uid}"
        headers = {
            "Authorization": f"Bearer {id_token}"
        }
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            task_data = response.json().get("tasks")
            print(f"TASK RESPONSE: {task_data}")
            if not task_data:
                print("No tasks returned from backend.")
                return JSONResponse(status_code=response.status_code, content={"message": "No tasks to schedule"})
        else:
            print(f"Error: Received unexpected status code {response.status_code}: {response.text}")
            return JSONResponse(status_code=response.status_code, content={"message": "Failed to retrieve tasks from backend"})
    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(status_code=500, content={"message": "An unexpected error occurred while fetching tasks"})

    scheduler = TaskScheduler(task_data)

    if scheduler.has_tasks_to_schedule:
        scheduler.schedule_tasks(debug=True)
        print(f'SCHEDULE: {scheduler.schedule}\n')

        # TODO: save schedule in backend
        try:
            url = f"http://localhost:5050/api/worktimes/addnewschedule/{uid}"
            headers = {
                "Authorization": f"Bearer {id_token}",
                "Content-Type": "application/json"
            }
            body = {
                "schedule": scheduler.schedule
            }
            print(f"Sending data: {json.dumps(body)}")
            response = requests.post(url, headers=headers, data=json.dumps(body))

            if response.status_code == 201:
                data = response.json()
                print(f"Worktime to database response: {data}")
            else:
                print(f"Error: Received unexpected status code {response.status_code} while saving schedule: {response.text}")
                return JSONResponse(status_code=response.status_code, content={"message": "Failed to store worktimes in database"})
        except Exception as e:
            print(f"Unexpected error: {e}")
            return JSONResponse(status_code=500, content={"message": "An unexpected error occurred while saving schedule"})


        return JSONResponse(
            content={
                "status": "success",
                "message": "Schedule successfully generated and stored"
            }
        )
    else:
        return JSONResponse(
            content={
                "status": "success",
                "message": "No tasks to schedule!"
            }
        )