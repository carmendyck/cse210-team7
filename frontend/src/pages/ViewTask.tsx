import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonPage, IonTitle, IonToolbar, IonText, IonItemDivider } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './ViewTask.css'; // Import the CSS file

const ViewTask: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [timer, setTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem('timer');
    const savedStartTime = localStorage.getItem('startTime');
    if (savedTimer && savedStartTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      return parseInt(savedTimer, 10) + elapsedTime;
    }
    return 0;
  });
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const savedIsRunning = localStorage.getItem('isRunning');
    return savedIsRunning ? JSON.parse(savedIsRunning) : false;
  });
  let timerInterval: NodeJS.Timeout;

  useEffect(() => {
    console.log("ViewTask mounted or URL changed:", location.pathname);
    setForceUpdate(prev => prev + 1);
  }, [location.pathname]); // Runs when the route changes

  useEffect(() => {
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem('timer', timer.toString());
    localStorage.setItem('isRunning', JSON.stringify(isRunning));
    if (isRunning) {
      localStorage.setItem('startTime', Date.now().toString());
    } else {
      localStorage.removeItem('startTime');
    }
  }, [timer, isRunning]);

  const handleBack = () => {
    history.replace("/tasklist"); // Redirects to the main app
  };

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      setTimer(0); // Reset the timer to 0 when stopping
    } else {
      setIsRunning(true);
    }
  };

  return (
    <IonPage key={forceUpdate}>
      <IonToolbar>
        <IonTitle>View Task</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
        <IonButton className="back-button" onClick={handleBack}>
          &#8592; {/* Unicode for left arrow */}
        </IonButton>
        <div className="content-wrapper">
          <IonText className="task-name">
            <h1>CSE 210 User Stories</h1>
          </IonText>
          <div className="details-container">
            <IonText className="details">
              <p><strong>Due: </strong>January 29, 2025</p>
              <p><strong>Time Estimate: </strong>0.5 hours</p>
            </IonText>
            <div className="priority-box">P0</div>
          </div>
          <IonItemDivider />
          <IonText className="description">
            <p><strong>Description:</strong></p>
            <p>
              Come up with user stories, break into subtasks, add to Github project 
            </p>
          </IonText>
          <IonItemDivider />
          <div className="timer-container">
            <IonText className="timer-display">
              <h2>{new Date(timer * 1000).toISOString().substr(11, 8)}</h2>
            </IonText>
            <IonButton onClick={toggleTimer}>
              {isRunning ? 'Stop Timer' : 'Start Timer'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewTask;