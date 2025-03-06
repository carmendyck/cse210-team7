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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uid) {
      const fetchPreferences = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:5050/api/breaks/getBreaks?user_id=${uid}`);
          if (!response.ok) throw new Error("Failed to fetch preferences");
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
          setIsLoading(false);
        }
      };

      fetchPreferences();
    }
  }, [uid]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5050/api/breaks/updateBreaks", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breakDuration, workDuration, selectedBreaks, user_id: uid }),
      });
      if (!response.ok) throw new Error("Error saving preferences");
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

      <IonContent fullscreen className="ion-padding">
        {isLoading ? (
          <IonLoading isOpen={isLoading} message={"Loading preferences..."} />
        ) : (
          <>
            <IonItem>
              <IonLabel>How long do you like to work for (minutes)?</IonLabel>
            </IonItem>
            <IonRange
              min={15}
              max={120}
              step={5}
              value={workDuration}
              pin
              onIonChange={(e) => setWorkDuration(e.detail.value as number)}
            >
              <IonLabel slot="start">15 min</IonLabel>
              <IonLabel slot="end">120 min</IonLabel>
            </IonRange>
            <IonItem>
              <IonLabel>Current work duration: {workDuration} minutes</IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>How long do you like your breaks (minutes)?</IonLabel>
            </IonItem>
            <IonRange
              min={5}
              max={60}
              step={1}
              value={breakDuration}
              pin
              onIonChange={(e) => setBreakDuration(e.detail.value as number)}
            >
              <IonLabel slot="start">5 min</IonLabel>
              <IonLabel slot="end">60 min</IonLabel>
            </IonRange>
            <IonItem>
              <IonLabel>Current break duration: {breakDuration} minutes</IonLabel>
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

            <div className="ion-text-center ion-padding">
              <IonButton expand="block" shape="round" fill="solid" color="primary" onClick={handleSave}>
                Save
              </IonButton>
            </div>
          </>
        )}

        <IonLoading isOpen={isSaving} message={"Saving preferences..."} />
      </IonContent>
    </IonPage>
  );
};

export default Breaks;
