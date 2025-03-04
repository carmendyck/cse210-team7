import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext
import {
  InputChangeEventDetail,
  IonInputCustomEvent,
  IonRangeCustomEvent,
  RangeChangeEventDetail,
  IonCheckboxCustomEvent,
  CheckboxChangeEventDetail
} from '@ionic/core';

import {
  IonButton,
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonRange,
  IonCheckbox,
  IonList,
  IonLoading,
} from "@ionic/react";


const Breaks: React.FC = () => {
  const { uid } = useAuth(); // Using AuthContext to get user ID
  const history = useHistory();

  const [breakDuration, setBreakDuration] = useState(5);
  const [workDuration, setWorkDuration] = useState(30);

  const [selectedBreaks, setSelectedBreaks] = useState<Record<string, boolean>>({
    "Water Break": true,
    "Snack Break": true,
    "Active Break": true,
    "Meditation Break": true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleRangeChange = (e: IonRangeCustomEvent<RangeChangeEventDetail>, field: 'breakDuration' | 'workDuration') => {
    const value = e.detail.value as number;
    console.log(`Field [${field}] set to [${value}]`);
    if (field === 'breakDuration') {
      setBreakDuration(value);
    } else {
      setWorkDuration(value);
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

  // const handleBack = () => {
  //   history.push("/preferences"); // Redirects to preferences page
  // };

  const handleSave = async () => {
    setIsSaving(true);

    console.log("Storing break preferences: ", {
      breakDuration,
      workDuration,
      selectedBreaks,
      user_id: uid,
    });

    try {
      // Example API call (replace with your actual API endpoint)
      const response = await fetch("http://localhost:5050/api/breaks/updateBreaks", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breakDuration,
          workDuration,
          selectedBreaks,
          user_id: uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error storing preferences, fetching from API: ", data.error || 'Unknown error');
      } else {
        console.log("Preferences successfully saved:", data);
        setTimeout(() => {
          setIsSaving(false);
          history.push("/preferences"); // Redirect after successful save
        }, 1500); // Delay for 1.5 seconds
      }
    } catch (error) {
      console.error("Error connecting to the API: ", error);
    }
    // finally {
    //   setIsSaving(false);
    // }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/preferences" /* onClick={handleBack} */ />
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
            onIonChange={(e) => handleRangeChange(e, 'workDuration')}
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
            onIonChange={(e) => handleRangeChange(e, 'breakDuration')}
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
        <IonToolbar>
            <IonButtons slot="primary">
                <IonButton shape="round" fill="solid" color="primary" onClick={handleSave}>Save</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonLoading
            isOpen={isSaving}
            message={'Saving preferences...'}
          />
      </IonContent>
    </IonPage>
  );
};

export default Breaks;