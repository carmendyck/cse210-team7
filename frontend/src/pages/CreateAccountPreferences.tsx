import { IonButton, IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";

const CreateAccountPreferences: React.FC = () => {
  const history = useHistory();

  const handleBack = () => {
    history.push("/tasklist"); // Redirects to the main app
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Set Preferences</IonTitle>
      </IonToolbar>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleBack}>Done</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateAccountPreferences;