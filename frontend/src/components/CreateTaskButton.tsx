import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { useLocation, useHistory } from "react-router-dom";

// Add position props with default values
interface CreateTaskButtonProps {
  vertical?: "bottom" | "top" | "center";
  horizontal?: "end" | "start" | "center";
  className?: string;
}

const excludedPages: string[] = ["/login", "/create_acct_pref",
                                "/create_acct_pref_pg2", "/createtask"]

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({ 
  vertical = "bottom", 
  horizontal = "end",
  className = ""
}) => {
  const location = useLocation();
  const history = useHistory();

  // Hide the button on various app pages
  const isExcluded = excludedPages.includes(location.pathname) ||
    /^\/(edittask|viewtask)\/.+/.test(location.pathname);

  if (isExcluded) {
    return null;
  }

  return (
    <IonFab vertical={vertical} horizontal={horizontal} slot="fixed" className={className}>
      <IonFabButton onClick={() => history.push("/createtask")}>
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
};

export default CreateTaskButton;
