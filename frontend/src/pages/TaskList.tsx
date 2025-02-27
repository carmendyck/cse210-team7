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
  IonCheckbox
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './TaskList.css';

import { TaskListItem } from '../interfaces/TaskListItemInterface';

// const initialTasks = [
//   { id: 'Ebj1j5kdNkrcqPwYMpBx', title: "Finish CSE210 homework", duration: "5h", dueDate: "Feb 15", category: "study", color: "red" },
//   { id: 'AqEq8KnXVGc8F98Hy4LL', title: "Prepare a presentation", duration: "2h", dueDate: "Feb 16", category: "study", color: "yellow" },
//   { id: '7mRIqexhfoOBbxSts6aa', title: "Go to the Gym", duration: "1h", dueDate: "Feb 17", category: "personal", color: "green" },
//   { id: '3T8cAvTXcbQMerDZNFnF', title: "Plan your meal", duration: "20mins", dueDate: "Feb 18", category: "personal", color: "green" },
//   { id: '1ah9j2KOEXvnrXo570o9', title: "Review daily goals before sleeping.", duration: "5mins", dueDate: "Feb 19", category: "personal", color: "green" }
// ];

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskListItem[]>([])
  // const [tasks, setTasks] = useState<{id: string, name: string, total_time_estimate: number, priority: number, completed: boolean, due_datetime: string, time_spent: number } | null>(null); 
  const history = useHistory();
  const { logout } = useAuth();
  const { uid } = useAuth();

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
  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId); // Filter out the selected task
    setTasks(updatedTasks); // Update the state to remove the task
  };

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

  // gets tasks once on page load
  // TODO: figure out why this is getting called 4 times
  useEffect(() => {
    getAllTasks();
  }, []);

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
        <IonList>
          {tasks.map((task) => (
            <IonItem key={task.id} className={`task-item ${defaultColor}`} onClick={() => selectTask(task.id)}>
              <IonCheckbox
                slot="start"
                onClick={(e) => e.stopPropagation()} 
                onIonChange={() => removeTask(task.id)}
              />
              <IonLabel>
                <h2>{task.name}</h2>
                <p className="due-date">Due: {task.due_datetime.toLocaleString()}</p>
              </IonLabel>
              <span className="duration">{task.total_time_estimate}</span>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TaskList;
