import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useHistory } from "react-router-dom";
import './TaskList.css';

const TaskList: React.FC = () => {
  const history = useHistory();

  const selectTask = () => {
    console.log("moved to viewtask");
    history.replace("/viewtask");
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
