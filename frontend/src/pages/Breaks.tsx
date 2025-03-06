import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
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
  const { uid } = useAuth(); 
  const history = useHistory();

  const [breakDuration, setBreakDuration] = useState(5);
  const [workDuration, setWorkDuration] = useState(30);
  const [selectedBreaks, setSelectedBreaks] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial loading of preferences



  // Load user preferences on component mount
  const fetchPreferences = async (
    uid: string,
    setWorkDuration: React.Dispatch<React.SetStateAction<number>>,
    setBreakDuration: React.Dispatch<React.SetStateAction<number>>,
    setSelectedBreaks: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setIsLoading(true);  // Start loading
      const response = await fetch(`http://localhost:5050/api/breaks/getBreaks?user_id=${uid}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch preferences (status ${response.status})`);
      }
  
      const data = await response.json();
  
      setWorkDuration(data.work_duration ?? 30);
      setBreakDuration(data.break_duration ?? 5);
      setSelectedBreaks(data.selected_breaks ?? {
        "Water Break": true,
        "Snack Break": true,
        "Active Break": true,
        "Meditation Break": true,
      });
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    if (uid) {
      fetchPreferences(uid, setWorkDuration, setBreakDuration, setSelectedBreaks, setIsLoading);
    }
  }, [uid]);
  

  const handleSave = async () => {
    setIsSaving(true);

    try {
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
        throw new Error(data.error || "Error saving preferences");
      }

      console.log("Preferences successfully saved:", data);
      history.push("/preferences"); 
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false); 
    }
  };

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
        {isLoading ? (
          <IonLoading isOpen={isLoading} message={"Loading preferences..."} />
        ) : (
          <>
            <IonItem>
              <IonLabel>How long do you prefer to work before a break (in minutes)?</IonLabel>
              <IonRange
                min={15}
                max={120}
                step={5}
                value={workDuration}
                onIonChange={(e) => setWorkDuration(e.detail.value as number)}
                labelPlacement="fixed"
                label={`${workDuration} min`}
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
                onIonChange={(e) => setBreakDuration(e.detail.value as number)}
                labelPlacement="fixed"
                label={`${breakDuration} min`}
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
                    onIonChange={(e) => 
                      setSelectedBreaks((prev) => ({
                        ...prev,
                        [breakType]: e.detail.checked,
                      }))
                    }
                  />
                </IonItem>
              ))}
            </IonList>

            <IonToolbar>
              <IonButtons slot="primary">
                <IonButton shape="round" fill="solid" color="primary" onClick={handleSave}>
                  Save
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </>
        )}
        <IonLoading isOpen={isSaving} message={"Saving preferences..."} />
      </IonContent>
    </IonPage>
  );
};

export default Breaks;
