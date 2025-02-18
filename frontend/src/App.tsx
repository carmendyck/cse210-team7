import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendarOutline, listOutline, settingsOutline } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateTaskButton from "./components/CreateTaskButton";
import CreateTask from "./pages/CreateTask";
import CreateAccountPreferences from "./pages/CreateAccountPreferences";
import ViewTask from "./pages/ViewTask";
import Preferences from "./pages/Preferences";
import Breaks from "./pages/Breaks";
import Notifications from "./pages/Notifications";
import CalendarView from "./pages/CalendarView";
import { AuthProvider, useAuth } from "./context/AuthContext";


import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

const ProtectedRoute: React.FC<{ exact?: boolean; path: string; component: React.FC }> = ({ exact, path, component }) => {
  const { user } = useAuth();
  return user ? <Route exact={exact} path={path} component={component} /> : <Redirect to="/login" />;
};

const RenderContent: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <IonRouterOutlet animated={false} key={location.pathname}>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <ProtectedRoute exact path="/tasklist" component={Home} />
        <ProtectedRoute exact path="/createtask" component={CreateTask} />
        <ProtectedRoute exact path="/create_acct_pref" component={CreateAccountPreferences} />
        <ProtectedRoute exact path="/viewtask" component={ViewTask} />
        <ProtectedRoute exact path="/breaks" component={Breaks} />
        <ProtectedRoute exact path="/notifications" component={Notifications} />
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
      {location.pathname !== "/login" && location.pathname !== "/signup" && <CreateTaskButton />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <AuthProvider>
          <RenderContent />
          <Route path={["/calendar", "/tasklist", "/preferences"]}>
            <IonTabs>
              <IonRouterOutlet>
                <ProtectedRoute exact path="/calendar" component={CalendarView} />
                <ProtectedRoute exact path="/tasklist" component={Home} />
                <ProtectedRoute exact path="/preferences" component={Preferences} />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="calendar" href="/calendar">
                  <IonIcon icon={calendarOutline} />
                  <IonLabel>Calendar</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tasklist" href="/tasklist">
                  <IonIcon icon={listOutline} />
                  <IonLabel>Tasks</IonLabel>
                </IonTabButton>
                <IonTabButton tab="preferences" href="/preferences">
                  <IonIcon icon={settingsOutline} />
                  <IonLabel>Preferences</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </Route>
        </AuthProvider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
