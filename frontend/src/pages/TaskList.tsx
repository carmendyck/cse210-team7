import { 
  IonButton, 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonDatetime
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DatetimeChangeEventDetail, IonDatetimeCustomEvent } from "@ionic/core";
import './TaskList.css';
import { TaskListItem } from '../interfaces/TaskListItemInterface';

function formatDueDate(dueDatetime: string): string {
  const date = new Date(dueDatetime); 
  const year = date.getFullYear(); 
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0"); 

  return `${year}-${month}-${day}`;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskListItem[]>([])
  const history = useHistory();
  const { logout } = useAuth();
  const { uid } = useAuth();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // e.g. "2025-02-23"
  });

  // TODO: associate priority with color.
  // this is here since priority hasn't been implemented yet,
  // and database has no color field
  const defaultColor = "green"; 

  const selectTask = (taskId: string) => {
    console.log("Moved to viewtask");
    history.push(`/viewtask/${taskId}`);
  };

  // TODO: Connect to backend
  // + possibly move to bottom (checked) instead of making it disappear from list
  // const removeTask = (taskId: string) => {
  //   const updatedTasks = tasks.filter(task => task.id !== taskId); // Filter out the selected task
  //   setTasks(updatedTasks); // Update the state to remove the task
  // };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  // const getAllTasks = async () => {
  //   try {
  //     console.log("fetching tasks for uid ", uid);
  //     const response = await fetch(`http://localhost:5050/api/tasklist/getAllTasks/${uid}`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const data = await response.json();
      
  //     if (!response.ok) {
  //       console.log("Error fetching tasks: ", data.error || 'Unknown error');
  //       throw new Error("Failed to fetch task");
  //     }

  //     console.log(data.message);

  //     const taskList : TaskListItem[] = data.tasks;
  //     setTasks(taskList);
  //     console.log("Task List:", taskList);

  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // }

  const getAllTasks = async () => {
  try {
    console.log("Fetching tasks for uid:", uid);
    const response = await fetch(`http://localhost:5050/api/tasklist/getAllTasks/${uid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching tasks:", data.error || 'Unknown error');
      throw new Error("Failed to fetch tasks");
    }

    const taskList: TaskListItem[] = await Promise.all(
      data.tasks.map(async (task: TaskListItem) => {
        const priority = await fetchTaskPriority(task.id);
        return { ...task, priority };
      })
    );


    setTasks(taskList);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};


  const removeTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/closeTask/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }
  
      const data = await response.json();
      console.log("Response Data:", data);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (error) {
      console.error("Error closing task:", error);
    }
  };

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:5051'
  : 'http://192.168.86.232:5051';

const fetchTaskPriority = async (taskId: string): Promise<number | null> => {
  try {
    console.log(`Fetching priority for task ID: ${taskId}`);

    const response = await fetch(`http://127.0.0.1:5051/api/task-priority/${taskId}`);
    
    console.log(`Response Status: ${response.status}`);
    
    const data = await response.json();
    console.log(`Priority Data Received: `, data);

    if (!response.ok) {
      console.error(`Error: Received status ${response.status}`);
      return null;
    }

    return data.priority;
  } catch (error) {
    console.error(`Error fetching priority for task ${taskId}:`, error);
    return null;
  }
};

  // gets tasks once on page load
  // TODO: figure out why this is getting called 4 times
  useEffect(() => {
    getAllTasks();
  }, []);

  const handleDateChange = (e: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) => {
    const value = e.detail.value;
    if (typeof value === "string") {
      const dateOnly = value.split('T')[0]; // "YYYY-MM-DD"
      setSelectedDate(dateOnly);
      console.log("Selected date: ", dateOnly);
    }
  };

  const unfinishedTasks = tasks.filter(task => !task.completed && formatDueDate(task.due_datetime.toLocaleString()) === selectedDate);
  const finishedTasks = tasks.filter(task => task.completed && formatDueDate(task.due_datetime.toLocaleString()) === selectedDate);

  return (
    
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task List</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        <IonItem lines="none" className="centered-datetime-item">
          <IonDatetime
            presentation="date"
            preferWheel={true}
            mode="ios"
            value={selectedDate}
            onIonChange={handleDateChange}
            className="my-datetime"
          />
        </IonItem>

        {/* Unfinished Tasks */}
        {unfinishedTasks.length > 0 && (
        <>
          <h2 className="section-title">Unfinished</h2>
          <IonList>
            {unfinishedTasks.map((task) => (
              <IonItem
                key={task.id}
                className={`task-item ${defaultColor}`}
                onClick={() => selectTask(task.id)}
              >
                <IonCheckbox
                  slot="start"
                  onClick={(e) => e.stopPropagation()}
                  onIonChange={() => removeTask(task.id)}
                />
                <IonLabel>
                  <h2>{task.name}</h2>
                  <p className="due-date">Due: {formatDueDate(task.due_datetime.toLocaleString())}</p>
                </IonLabel>

                <div className="task-details">
                  <span className="duration">{task.total_time_estimate} hrs</span>
                  {typeof task.priority === "number" && (
                    <div className="priority-box">{task.priority}</div>
                  )}
                </div>
              </IonItem>
            ))}
          </IonList>
        </>
      )}


          {/* Finished Tasks */}
          {finishedTasks.length > 0 && (
          <>
            <h2 className="section-title">Finished</h2>
            <IonList>
              {finishedTasks.map((task) => (
                <IonItem
                  key={task.id}
                  className={`task-item ${defaultColor}`}
                >
                  <IonCheckbox
                    slot="start"
                    checked={true}
                    disabled={true}
                  />
                  <IonLabel>
                    <h2>{task.name}</h2>
                    <p className="due-date">Due: {formatDueDate(task.due_datetime.toLocaleString())}</p>
                  </IonLabel>

                  <div className="task-details">
                    <span className="duration">{task.total_time_estimate} hrs</span>
                    {typeof task.priority === "number" && (
                      <div className="priority-box">{task.priority}</div>
                    )}
                  </div>
                </IonItem>
              ))}
            </IonList>
          </>
        )}



      </IonContent>
    </IonPage>
  );
};

export default TaskList;

