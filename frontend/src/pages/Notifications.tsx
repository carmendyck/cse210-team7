import { IonButtons, IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonToggle } from '@ionic/react';
import { useState } from 'react';

const Notifications: React.FC = () => {
  const [lockScreen, setLockScreen] = useState(true);
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(true);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/preferences" />
          </IonButtons>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel>Enable Lock Screen notifications</IonLabel>
          <IonToggle slot="end" checked={lockScreen} onIonChange={(e) => setLockScreen(e.detail.checked)} />
        </IonItem>
        <IonItem>
          <IonLabel>Enable Text/SMS notifications</IonLabel>
          <IonToggle slot="end" checked={sms} onIonChange={(e) => setSms(e.detail.checked)} />
        </IonItem>
        <IonItem>
          <IonLabel>Enable Email notifications</IonLabel>
          <IonToggle slot="end" checked={email} onIonChange={(e) => setEmail(e.detail.checked)} />
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Notifications;


