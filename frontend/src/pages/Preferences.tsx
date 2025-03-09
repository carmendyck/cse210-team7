import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { timeOutline, calendarOutline, notificationsOutline, settingsOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Preferences.css';

const Preferences: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Preferences</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {/* <IonItem button onClick={() => history.push('/time-preferences')}>
            <IonIcon slot="start" icon={timeOutline} />
            <IonLabel>Time Preferences</IonLabel>
            <IonIcon slot="end" icon={settingsOutline} />
          </IonItem>
          <IonItem button onClick={() => history.push('/calendar-viewing')}>
            <IonIcon slot="start" icon={calendarOutline} />
            <IonLabel>Calendar Viewing</IonLabel>
            <IonIcon slot="end" icon={settingsOutline} />
          </IonItem> */}
          <IonItem button onClick={() => history.push('/notifications')}>
            <IonIcon slot="start" icon={notificationsOutline} />
            <IonLabel>Notifications</IonLabel>
            <IonIcon slot="end" icon={settingsOutline} />
          </IonItem>
          <IonItem button onClick={() => history.push('/breaks')}>
            <IonIcon slot="start" icon={settingsOutline} />
            <IonLabel>Breaks</IonLabel>
            <IonIcon slot="end" icon={settingsOutline} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Preferences;
