// import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonCheckbox, IonIcon } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import { useHistory } from "react-router-dom";
import './TaskList.css';

// const TaskList: React.FC = () => {
//   const history = useHistory();

//   const selectTask = () => {
//     console.log("moved to viewtask");
//     history.replace("/viewtask");
//     window.location.reload(); // TODO: Figure out how to remove this
//   };

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>TaskList</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent fullscreen>
//         <IonHeader collapse="condense">
//           <IonToolbar>
//             <IonTitle size="large">TaskList</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <ExploreContainer name="Tab 1 page" />
//         <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
//           <IonButton expand="full" onClick={selectTask}>Task A</IonButton>
//         </IonContent>
//       </IonContent>
//     </IonPage>
//   );
// };
const tasks = [
  { id: 1, title: "Finish CSE210 homework", duration: "5h", category: "study", color: "red" },
  { id: 2, title: "Prepare a presentation", duration: "2h", category: "study", color: "yellow" },
  { id: 3, title: "Go to the Gym", duration: "1h", category: "personal", color: "green" },
  { id: 4, title: "Plan your meal", duration: "20mins", category: "personal", color: "green" },
  { id: 5, title: "Review daily goals before sleeping.", duration: "5mins", category: "personal", color: "green" }
];

const TaskList: React.FC = () => {
  const history = useHistory();

  const selectTask = (taskId: number) => {
    console.log("moved to viewtask");
    // history.replace("/viewtask");
    history.push(`/viewtask/${taskId}`);
    window.location.reload(); // TODO: Figure out how to remove this
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TaskList</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Date Selector */}
        <div className="date-selector">
          <span className="inactive">WED 25</span>
          <span className="active">THU 26</span>
          <span className="inactive">FRI 27</span>
          <span className="inactive">SAT 28</span>
          <span className="inactive">SUN 29</span>
        </div>

        {/* Task List */}
        <IonList>
          {tasks.map((task) => (
            <IonItem key={task.id} className={`task-item ${task.color}`} button onClick={() => selectTask(task.id)}>
              <IonCheckbox slot="start" />
              <IonLabel>
                <h2>{task.title}</h2>
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
