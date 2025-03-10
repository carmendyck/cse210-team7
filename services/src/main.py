from fastapi import FastAPI, Header, HTTPException
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import auth, credentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from task_estimater import TaskEstimator
from task_helpers import Task

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

    url = f"http://localhost:5050/api/courseSelect/getCourse/{task.course_id}"
    headers = {
        "Authorization": f"Bearer {id_token}"
    }
    response = requests.get(url, headers=headers)
    print("printing response: ")
    print(response)
    print(response.json())
    task.add_course_info(response.json()["course"])

    est = TaskEstimator(task)
    print(est.estimate_time())
    return JSONResponse(content=task_data)