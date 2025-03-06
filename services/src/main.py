from fastapi import FastAPI, Header, HTTPException
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import auth, credentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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
async def get_task(task_id: str, authorization: str = Header(None)):
    print('getting task')
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split("Bearer ")[1]
    id_token = auth.verify_id_token(token)
    db = firestore.client()

    # Get information from backend:
    # task_id = "jzmvSAC0lvu4jojfU57b"
    url = f"http://localhost:5050/api/viewTask/getTask/{task_id}"
    headers = {
        "Authorization": f"Bearer {id_token}"
    }
    response = requests.get(url, headers=headers)
    task_data = response.json()["task"]
    print(f"TASK RESPONSE: {task_data}")
    return JSONResponse(content=task_data)