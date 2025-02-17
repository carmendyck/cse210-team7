import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendarOutline, listOutline, settingsOutline } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/Login";
import CreateTaskButton from "./components/CreateTaskButton";
import CreateTask from "./pages/CreateTask";
import CreateAccountPreferences from "./pages/CreateAccountPreferences";
import ViewTask from "./pages/ViewTask";
import Preferences from "./pages/Preferences";
import Breaks from "./pages/Breaks";
import Notifications from "./pages/Notifications";
import CalendarView from "./pages/CalendarView";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        {/* Routes outside of tab navigation */}
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route exact path="/viewtask/:taskId" component={ViewTask} />
          <Route exact path="/createtask" component={CreateTask} />
          <Route exact path="/create_acct_pref" component={CreateAccountPreferences} />
          <Route exact path="/breaks" component={Breaks} />
          <Route exact path="/notifications" component={Notifications} />
          <Redirect exact from="/" to="/login" />
        </IonRouterOutlet>

        {/* Main Tabs with ONLY Calendar View, Task List, and Preferences */}
        <Route path={["/calendar", "/tasklist", "/preferences"]}>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/calendar" component={CalendarView} />
              <Route exact path="/tasklist" component={Home} />
              <Route exact path="/preferences" component={Preferences} />
            </IonRouterOutlet>

            {/* Bottom Nav Bar with Three Tabs */}
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
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

