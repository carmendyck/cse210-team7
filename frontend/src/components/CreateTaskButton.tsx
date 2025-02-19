import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { useLocation, useHistory } from "react-router-dom";

const CreateTaskButton: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  // Hide the button on the login page
  if (location.pathname === "/login" ||
      location.pathname == "/create_acct_pref" ||
      location.pathname == "/createtask"
  ) {
    return null;
  }

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton onClick={() => history.push("/createtask")}>
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
};

export default CreateTaskButton;
