import { IonButton, IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface RouteParams {
  taskId: string;
}


const ViewTask: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);

  // useEffect(() => {
  //   console.log("ViewTask mounted or URL changed:", location.pathname);
  //   setForceUpdate(prev => prev + 1);
  // }, [location.pathname]); // Runs when the route changes
  const { taskId } = useParams<RouteParams>();
  useEffect(() => {
    console.log("ViewTask mounted or URL changed, taskId:", taskId);
  }, [taskId]);

  const handleBack = () => {
    history.replace("/tasklist"); // Redirects to the main app
  };

  return (
    <IonPage key={forceUpdate}>
      <IonToolbar>
        {/* <IonTitle>View Task</IonTitle> */}
        <IonTitle>View Task {taskId}</IonTitle>
      </IonToolbar>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleBack}>Back</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ViewTask;