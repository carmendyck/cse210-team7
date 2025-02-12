import { IonButton, IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const history = useHistory();

  const handleEnter = () => {
    history.push("/tasklist"); // Redirects to the main app
  };

  const handleNewAcct = () => {
    history.push("/create_acct_pref"); // Redirects to the create an account preferences page
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Login</IonTitle>
      </IonToolbar>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleEnter}>Login</IonButton>
      </IonContent>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleNewAcct}>Create Account</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
