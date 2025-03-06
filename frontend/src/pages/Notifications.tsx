import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  IonLoading
} from '@ionic/react';

const Notifications: React.FC = () => {
  const { uid } = useAuth();
  const history = useHistory();

  const [lockScreen, setLockScreen] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user notification preferences
  const fetchNotificationPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5050/api/notifications/getNotifications?user_id=${uid}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch notification preferences (status ${response.status})`);
      }

      const data = await response.json();
      setLockScreen(data.lock_screen ?? true);
      setInApp(data.in_app ?? true);
      setEmail(data.email ?? true);
    } catch (error) {
      console.error("Error loading notification preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchNotificationPreferences();
    }
  }, [uid]);

  // Save updated notification preferences
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5050/api/notifications/updateNotifications", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lockScreen,
          inApp,
          email,
          user_id: uid,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error saving notification preferences");
      }

      console.log("Notification preferences successfully saved:", data);
      history.push("/preferences");
    } catch (error) {
      console.error("Error saving notification preferences:", error);
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
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoading ? (
          <IonLoading isOpen={isLoading} message={"Loading preferences..."} />
        ) : (
          <>
            <IonItem>
              <IonLabel>Enable Lock Screen notifications</IonLabel>
              <IonToggle slot="end" checked={lockScreen} onIonChange={(e) => setLockScreen(e.detail.checked)} />
            </IonItem>
            <IonItem>
              <IonLabel>Enable In-App notifications</IonLabel>
              <IonToggle slot="end" checked={inApp} onIonChange={(e) => setInApp(e.detail.checked)} />
            </IonItem>
            <IonItem>
              <IonLabel>Enable Email notifications</IonLabel>
              <IonToggle slot="end" checked={email} onIonChange={(e) => setEmail(e.detail.checked)} />
            </IonItem>

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

export default Notifications;


