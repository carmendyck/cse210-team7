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

  const getAllTasks = async () => {
    try {
      console.log("fetching tasks for uid ", uid);
      const response = await fetch(`http://localhost:5050/api/tasklist/getAllTasks/${uid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.log("Error fetching tasks: ", data.error || 'Unknown error');
        throw new Error("Failed to fetch task");
      }

      console.log(data.message);

      const taskList : TaskListItem[] = data.tasks;
      setTasks(taskList);
      console.log("Task List:", taskList);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

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

  const openTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/openTask/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const data = await response.json();
      console.log("Response Data:", data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const handleCheckboxChange = async (taskId: string, completed: boolean) => {
    try {
      if (completed) {
        await openTask(taskId);
      } else {
        await removeTask(taskId);
      }
  
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
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
                    onIonChange={() => handleCheckboxChange(task.id, task.completed)}
                  />
                  <IonLabel>
                    <h2>{task.name}</h2>
                    <p className="due-date">Due: {formatDueDate(task.due_datetime.toLocaleString())}</p>
                  </IonLabel>
                  <span className="duration">{task.total_time_estimate}</span>
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
                    onClick={(e) => e.stopPropagation()}
                    checked={task.completed}
                    onIonChange={() => handleCheckboxChange(task.id, task.completed)}
                  />
                  <IonLabel>
                    <h2>{task.name}</h2>
                    <p className="due-date">Due: {formatDueDate(task.due_datetime.toLocaleString())}</p>
                  </IonLabel>
                  <span className="duration">{task.total_time_estimate}</span>
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

