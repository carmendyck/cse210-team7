import { IonButtons, IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonRange, IonCheckbox, IonList } from '@ionic/react';
import { useState } from 'react';

const Breaks: React.FC = () => {
  const [breakDuration, setBreakDuration] = useState(15);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/preferences" />
          </IonButtons>
          <IonTitle>Breaks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel>How long do you like your breaks?</IonLabel>
          <IonRange min={5} max={60} step={5} value={breakDuration} onIonChange={(e) => setBreakDuration(e.detail.value as number)} />
        </IonItem>
        <IonList>
          <IonItem><IonLabel>Water Break</IonLabel><IonCheckbox slot="end" checked /></IonItem>
          <IonItem><IonLabel>Snack Break</IonLabel><IonCheckbox slot="end" checked /></IonItem>
          <IonItem><IonLabel>Active Break</IonLabel><IonCheckbox slot="end" checked /></IonItem>
          <IonItem><IonLabel>Meditation Break</IonLabel><IonCheckbox slot="end" checked /></IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Breaks;

