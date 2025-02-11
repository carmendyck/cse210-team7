import { IonButton, IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const history = useHistory();

  const handleEnter = () => {
    history.push("/tab1"); // Redirects to the main app
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Login</IonTitle>
      </IonToolbar>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleEnter}>Enter</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
