import { 
  IonButton, 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './TaskList.css';

const TaskList: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();

  const selectTask = () => {
    console.log("moved to viewtask");
    history.replace("/viewtask");
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TaskList</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">TaskList</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
        <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
          <IonButton expand="full" onClick={selectTask}>Task A</IonButton>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default TaskList;