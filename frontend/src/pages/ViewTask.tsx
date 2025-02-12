import { IonButton, IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ViewTask: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    console.log("ViewTask mounted or URL changed:", location.pathname);
    setForceUpdate(prev => prev + 1);
  }, [location.pathname]); // Runs when the route changes

  const handleBack = () => {
    history.replace("/tasklist"); // Redirects to the main app
  };

  return (
    <IonPage key={forceUpdate}>
      <IonToolbar>
        <IonTitle>View Task</IonTitle>
      </IonToolbar>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleBack}>Back</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ViewTask;