import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { useLocation, useHistory } from "react-router-dom";

const excludedPages: string[] = ["/login", "/create_acct_pref",
                                "/create_acct_pref_pg2", "/createtask"]

const CreateTaskButton: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  // Hide the button on the login page
  if (excludedPages.includes(location.pathname)
  if (excludedPages.includes(location.pathname)
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
