import { useHistory } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext
import { stringTimeOfDay, stringFlexibility} from "../util/prefConversions"
import "./CreateAccountPrefPage2.css"

import {
  // InputChangeEventDetail,
  // IonInputCustomEvent,
  IonRangeCustomEvent,
  RangeChangeEventDetail,
  IonCheckboxCustomEvent,
  CheckboxChangeEventDetail
} from '@ionic/core';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from "@ionic/react";

const CreateAccountPrefPage2: React.FC = () => {
  const { uid } = useAuth(); // Using AuthContext to get user ID
  const history = useHistory();

  const [isSaving, setIsSaving] = useState(false);
  
  const [mostProductiveTime, setMostProductiveTime] = useState(2);
  const [flexibility, setFlexibility] = useState(2);
  const [workDuration, setWorkDuration] = useState(30);
  const [breakDuration, setBreakDuration] = useState(5);
  const [selectedBreaks, setSelectedBreaks] = useState<Record<string, boolean>>({
      "Water Break": true,
      "Snack Break": true,
      "Active Break": true,
      "Meditation Break": true,
  });

  const handleRangeChange = (e: IonRangeCustomEvent<RangeChangeEventDetail>, field: string) => {
    const value = e.detail.value as number;
    console.log(`Field [${field}] set to [${value}]`);
    switch (field) {
      case 'mostProductiveTime':
        setMostProductiveTime(value);
        return;
      case 'flexibility':
        setFlexibility(value);
        return;
      case 'workDuration':
        setWorkDuration(value);
        return;
      default: // 'breakDuration'
        setBreakDuration(value);
        return;
    }
  };

  const handleCheckboxChange = (breakType: string, e: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => {
    const checked = e.detail.checked;
    console.log(`Checkbox Changed: ${breakType} is now ${checked}`);
    setSelectedBreaks((prev) => ({
      ...prev,
      [breakType]: checked,
    }));
  };

  const handleFinish = async () => {
    try {
      // Trigger save dialog pop up
      setIsSaving(true);

      // Gather data to push
      // - user_id, productivity, flexibility, work_duration, break_duration, selected_breaks
      console.log("Storing initial preferences for uid: ", uid, {
        mostProductiveTime,
        flexibility,
        workDuration,
        breakDuration,
        selectedBreaks,
        user_id: uid,
      })

      // Push preferences updates to DB
      const response = await fetch("http://localhost:5050/api/onboardPref/addInitialPrefs", {
        method: 'POST',
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
          mostProductiveTime,
          flexibility,
          workDuration,
          breakDuration,
          selectedBreaks,
          user_id: uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error storing preferences, fetching from API: ", data.error || 'Unknown error');
        throw new Error("Failed to store preferences");
      }

      // Success, redirect to main app
      console.log(data.message);
      // console.log("Preference ID: ", data.preferencesId);
      console.log("Preferences: ", data.preferences);

      setTimeout(() => {
        setIsSaving(false);
        history.push("/tasklist");
      }, 1500); // Delay for 1.5 seconds

    } catch (error) {
      console.error("Error connecting to the API: ", error);
    }
    // finally {
    //   setIsSaving(false);
    // }
  };


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
            <IonButton onClick={handleFinish}>Save & Finish</IonButton>
          </IonButtons>
          <IonTitle>Set-Up - Scheduling Preferences</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        
        <IonItemDivider>
          <IonLabel>When are you most productive?</IonLabel>
        </IonItemDivider>
        <IonItem>
          {/* <IonCheckbox labelPlacement="stacked">Morning</IonCheckbox>
          <IonCheckbox labelPlacement="stacked">Afternoon</IonCheckbox>
          <IonCheckbox labelPlacement="stacked">Evening</IonCheckbox>
          <IonCheckbox labelPlacement="stacked">Night</IonCheckbox> */}

          {/* For now I implemented this as a range/slider */}
          <IonRange min={0} max={4} step={1} value={mostProductiveTime}
              ticks={true} snaps={true}
              pin={true} pinFormatter={(value: number) => stringTimeOfDay(value)}
              onIonChange={(e) => handleRangeChange(e, 'mostProductiveTime')}
              labelPlacement="fixed" label={stringTimeOfDay(mostProductiveTime)}>
                <IonLabel slot="start">Morning</IonLabel>
                <IonLabel slot="end">Nighttime</IonLabel>
          </IonRange>
        </IonItem>

        <IonItemDivider>
          <IonLabel>How flexible is your schedule?</IonLabel>
        </IonItemDivider>
        <IonItem>
          <IonRange min={0} max={4} step={1} value={flexibility}
              ticks={true} snaps={true}
              pin={true} pinFormatter={(value: number) => stringFlexibility(value)}
              onIonChange={(e) => handleRangeChange(e, 'flexibility')}
              labelPlacement="fixed" label={stringFlexibility(flexibility)}>
                <IonLabel slot="start">Very Rigid</IonLabel>
                <IonLabel slot="end">Very Flexible</IonLabel>
          </IonRange>
        </IonItem>

        <IonItemDivider>
          <IonLabel>How long do you prefer to work before a break (in minutes)?</IonLabel>
        </IonItemDivider>
        <IonItem>
          <IonRange min={15} max={120} step={5} value={workDuration}
              ticks={true} snaps={true}
              pin={true} pinFormatter={(value: number) => `${value} min`}
              onIonChange={(e) => handleRangeChange(e, 'workDuration')}
              labelPlacement="fixed" label={`${workDuration} min`}>
                <IonLabel slot="start">15 min</IonLabel>
                <IonLabel slot="end">120 min</IonLabel>
          </IonRange>
        </IonItem>

        <IonItemDivider>
          <IonLabel>How long do you like your breaks (in minutes)?</IonLabel>
        </IonItemDivider>
        <IonItem>
          <IonRange
            min={5}
            max={60}
            step={1}
            value={breakDuration}
            ticks={true}
            snaps={true}
            pin={true}
            pinFormatter={(value: number) => `${value} min`}
            onIonChange={(e) => handleRangeChange(e, 'breakDuration')}
            labelPlacement="fixed"
            label={`${breakDuration} min`}
            style={{ width: '150%' }}
          >
            <IonLabel slot="start">5 min</IonLabel>
            <IonLabel slot="end">60 min</IonLabel>
          </IonRange>
        </IonItem>

        <IonItemDivider>
          <IonLabel>What types of breaks do you want suggestions for?</IonLabel>
        </IonItemDivider>
        <IonList>
          {Object.keys(selectedBreaks).map((breakType) => (
            <IonItem key={breakType}>
              <IonLabel>{breakType}</IonLabel>
              <IonCheckbox
                slot="end"
                checked={selectedBreaks[breakType]}
                onIonChange={(e) => handleCheckboxChange(breakType, e)}
              />
            </IonItem>
          ))}
        </IonList>

        <IonLoading
          isOpen={isSaving}
          message={'Saving preferences...'}
        />


      </IonContent>

    </IonPage>
  );
};

export default CreateAccountPrefPage2;