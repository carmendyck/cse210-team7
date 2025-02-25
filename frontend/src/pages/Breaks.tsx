import { IonButtons, IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonRange, IonCheckbox, IonList } from '@ionic/react';
import { useState } from 'react';
import './Breaks.css';

const Breaks: React.FC = () => {
  const [breakDuration, setBreakDuration] = useState(5);
  const [workDuration, setWorkDuration] = useState(30);
  const tickValues = [10, 20, 30, 40, 50, 60];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/preferences" />
          </IonButtons>
          <IonTitle>Break Preferences</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonItem>
          <IonLabel>How long do you prefer to work before a break (in minutes)?</IonLabel>
          <IonRange 
            min={15} 
            max={120} 
            step={5} 
            value={workDuration}
            ticks={true} 
            snaps={true}
            pin={true} 
            pinFormatter={(value: number) => `${value} min`}
            onIonChange={(e) => setWorkDuration(e.detail.value as number)}
            labelPlacement="fixed" 
            label={`${workDuration} min`}
            style={{ width: '150%' }}
          >
            <IonLabel slot="start">15 min</IonLabel>
            <IonLabel slot="end">120 min</IonLabel>
          </IonRange>
        </IonItem>

        <IonItem>
          <IonLabel>How long do you like your breaks (in minutes)?</IonLabel>
          <IonRange 
            min={5} 
            max={60} 
            step={1} 
            value={breakDuration}
            ticks={true} 
            snaps={true}
            pin={true} 
            pinFormatter={(value: number) => `${value} min`}
            onIonChange={(e) => setBreakDuration(e.detail.value as number)}
            labelPlacement="fixed" 
            label={`${breakDuration} min`}
            style={{ width: '150%' }}
          >
            <IonLabel slot="start">5 min</IonLabel>
            <IonLabel slot="end">60 min</IonLabel>
          </IonRange>
        </IonItem>

        <IonItem>
          <IonLabel>What types of breaks do you want suggestions for?</IonLabel>
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