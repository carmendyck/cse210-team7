import { IonButton, IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";

const CreateTask: React.FC = () => {
  const history = useHistory();

  const handleBack = () => {
    history.push("/tasklist"); // Redirects to the main app
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Create Task</IonTitle>
      </IonToolbar>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleBack}>Back</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateTask;