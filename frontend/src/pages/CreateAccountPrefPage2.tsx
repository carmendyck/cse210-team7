import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonRange, IonSegment, IonSegmentButton,IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useState } from 'react';

const CreateAccountPrefPage2: React.FC = () => {
  const history = useHistory();

  const handleFinish = () => {
    history.push("/tasklist"); // Redirects to the main app
  };

  const [mostProductiveTime, setMostProductiveTime] = useState(2);
  const [flexibility, setFlexibility] = useState(2);
  const [workDuration, setWorkDuration] = useState(30);

  // There's probably better ways to implement this conversion stuff lol 

  // converts ion-range value to time-of-day string to be displayed on pin + label
  function stringTimeOfDay(rangeValue: number) : string {
    switch(rangeValue) {
      case 0:
        return "Morning";
      case 1:
        return "Noon";
      case 2:
        return "Afternoon";
      case 3:
        return "Evening";
      default: // 4
        return "Nighttime";
    }
  }

  // converts ion-range value to time-of-day string to be displayed on pin + label
  function stringFlexibility(rangeValue: number) : string {
    switch(rangeValue) {
      case 0:
        return "Very Rigid";
      case 1:
        return "Moderately Rigid";
      case 2:
        return "Neutral";
      case 3:
        return "Moderately Flexible";
      default: // 4
        return "Very Flexible";
    }
  }

  // == Set-Up - Scheduling Preferences ==
  // -- When are you most productive? --
  // Morning / Afternoon / Evening / Night [multi-select]? --> just used slider for now...
  // -- How flexible or rigid is your schedule? --
  // Very Flexible / Moderately Flexible / Moderately Rigid / Very Rigid [slider] - ion-range
  // -- How long do you prefer to work before a break? --
  // 5 min - 2 hrs [incremented slider] - ion-range
  // [ Back ] [ Finish ] - ion-button

  // -----------------------------------------------------------------------------
  // * Below note is not in design currently but would make sense -
  // * not necessary for MVP but consider adding in future sprint if time permits:
  // * add stuff currently in settings page (Breaks, Notifications, Time Preferences)
  // * as part of set-up process

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/create_acct_pref"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleFinish}>Finish</IonButton>
          </IonButtons>
          <IonTitle>Set-Up - Scheduling Preferences</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonItem>
          <IonLabel>When are you most productive?</IonLabel>
          {/* <IonCheckbox labelPlacement="stacked">Morning</IonCheckbox>
          <IonCheckbox labelPlacement="stacked">Afternoon</IonCheckbox>
          <IonCheckbox labelPlacement="stacked">Evening</IonCheckbox>
          <IonCheckbox labelPlacement="stacked">Night</IonCheckbox> */}

          {/* For now I implemented this as a range/slider */}
          <IonRange min={0} max={4} step={1} value={mostProductiveTime}
              ticks={true} snaps={true}
              pin={true} pinFormatter={(value: number) => stringTimeOfDay(value)}
              onIonChange={(e) => setMostProductiveTime(e.detail.value as number)}
              labelPlacement="fixed" label={stringTimeOfDay(mostProductiveTime)}>
                <IonLabel slot="start">Morning</IonLabel>
                <IonLabel slot="end">Nighttime</IonLabel>
          </IonRange>
        </IonItem>

        <IonItem>
          <IonLabel>How flexible is your schedule?</IonLabel>
          <IonRange min={0} max={4} step={1} value={flexibility}
              ticks={true} snaps={true}
              pin={true} pinFormatter={(value: number) => stringFlexibility(value)}
              onIonChange={(e) => setFlexibility(e.detail.value as number)}
              labelPlacement="fixed" label={stringFlexibility(flexibility)}>
                <IonLabel slot="start">Very Rigid</IonLabel>
                <IonLabel slot="end">Very Flexible</IonLabel>
          </IonRange>
        </IonItem>

        <IonItem>
          <IonLabel>How long do you prefer to work before a break?</IonLabel>
          <IonRange min={15} max={120} step={5} value={workDuration}
              ticks={true} snaps={true}
              pin={true} pinFormatter={(value: number) => `${value} min`}
              onIonChange={(e) => setWorkDuration(e.detail.value as number)}
              labelPlacement="fixed" label={`${workDuration} min`}>
                <IonLabel slot="start">15 min</IonLabel>
                <IonLabel slot="end">120 min</IonLabel>
          </IonRange>
        </IonItem>


      </IonContent>

    </IonPage>
  );
};

export default CreateAccountPrefPage2;