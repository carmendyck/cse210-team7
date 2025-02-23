import { useState } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonCheckbox} from '@ionic/react';
import { useHistory } from "react-router-dom";
import './TaskList.css';

const initialTasks = [
  { id: '1', title: "Finish CSE210 homework", duration: "5h", dueDate: "Feb 15", category: "study", color: "red" },
  { id: '2', title: "Prepare a presentation", duration: "2h", dueDate: "Feb 16", category: "study", color: "yellow" },
  { id: '3', title: "Go to the Gym", duration: "1h", dueDate: "Feb 17", category: "personal", color: "green" },
  { id: '4', title: "Plan your meal", duration: "20mins", dueDate: "Feb 18", category: "personal", color: "green" },
  { id: 'ah9j2KOEXvnrXo570o9', title: "Review daily goals before sleeping.", duration: "5mins", dueDate: "Feb 19", category: "personal", color: "green" }
];

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const history = useHistory();

  const selectTask = (taskId: string) => {
    console.log("moved to viewtask");
    history.push(`/viewtask/${taskId}`);
  };

  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId); // Filter out the selected task
    setTasks(updatedTasks); // Update the state to remove the task
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TaskList</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonList>
          {tasks.map((task) => (
          <IonItem key={task.id} className={`task-item ${task.color}`} onClick={() => selectTask(task.id)}>
          <IonCheckbox
            slot="start"
            onClick={(e) => e.stopPropagation()} 
            onIonChange={() => removeTask(task.id)}
          />
          <IonLabel> 
            <h2>{task.title}</h2>
            <p className="due-date">Due: {task.dueDate}</p>
          </IonLabel>
          <span className="duration">{task.duration}</span>
        </IonItem>
          ))}
        </IonList>

   
      </IonContent>
    </IonPage>
  );
};

export default TaskList;
