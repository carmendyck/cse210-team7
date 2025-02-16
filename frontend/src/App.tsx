import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import { useLocation } from "react-router-dom"
import Home from './Home';
import Login from "./pages/Login";
import CreateTaskButton from "./components/CreateTaskButton";
import CreateTask from "./pages/CreateTask";
import CreateAccountPreferences from "./pages/CreateAccountPreferences";
import ViewTask from "./pages/ViewTask";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const RenderContent: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <IonRouterOutlet animated={false} key={location.pathname}>
        <Route exact path="/login" component={Login} />
        <Route exact path="/viewtask/:taskId" component={ViewTask} />
        <Route path="/tasklist" component={Home} />
        <Route path="/createtask" component={CreateTask} />
        <Route path="/create_acct_pref" component={CreateAccountPreferences} />
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
      {location.pathname !== "/login" && <CreateTaskButton />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <RenderContent />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;