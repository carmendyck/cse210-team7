import { IonButtons, IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonRange, IonCheckbox, IonList } from '@ionic/react';
import { useState } from 'react';
import './Breaks.css';  // Import the CSS file

const Breaks: React.FC = () => {
  const [breakDuration, setBreakDuration] = useState(15);
  const tickValues = [10, 20, 30, 40, 50, 60];

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
          <IonLabel>How long do you like your breaks (in minutes)?</IonLabel>
        </IonItem>
        <IonItem>
          <IonRange 
            min={10} 
            max={60} 
            step={10} 
            snaps 
            ticks 
            value={breakDuration} 
            onIonChange={(e) => setBreakDuration(e.detail.value as number)}
            data-testid="break-slider"
          />
        </IonItem>

        <div className="range-labels">
          {tickValues.map((value) => (
            <span key={value} className="range-label">{value}</span>
          ))}
        </div>
        
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




