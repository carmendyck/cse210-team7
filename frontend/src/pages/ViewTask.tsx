import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonPage, IonTitle, IonToolbar, IonText, IonItemDivider } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './ViewTask.css'; // Import the CSS file


interface ViewTaskProps {
  params: {
    id: string;
  };
}

// Use the id from the url via {params.id}

const ViewTask: React.FC<ViewTaskProps> = ({params}) => {
  const history = useHistory();
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [task, setTask] = useState<{ name: string, notes: string, total_time_estimate: number, priority: number } | null>(null); // Ensure correct type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Either load or start from 0
  const [timer, setTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem('timer');
    const savedStartTime = localStorage.getItem('startTime');
    const savedIsRunning = localStorage.getItem('isRunning');

    if (savedTimer) {
      // If the timer is running, calculate elapsed time
      if (savedIsRunning === "true" && savedStartTime) {
        const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
        return parseInt(savedTimer, 10) + elapsedTime;
      }
      return parseInt(savedTimer, 10);
    }
    return 0; // No timer running
  });

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const savedIsRunning = localStorage.getItem('isRunning');
    return savedIsRunning ? JSON.parse(savedIsRunning) : false;
  });

  const [isPaused, setIsPaused] = useState<boolean>(() => {
    const savedIsPaused = localStorage.getItem('isPaused');
    return savedIsPaused ? JSON.parse(savedIsPaused) : false;
  });

  let timerInterval: NodeJS.Timeout;

  useEffect(() => {
    console.log("ViewTask mounted or URL changed:", location.pathname);
    setForceUpdate(prev => prev + 1);
  }, [location.pathname]);

  const getTaskInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/getTask/${params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }
      const data = await response.json();
      console.log("Task Data:", data);
      setTask(data.task); // Store task in state
      console.log("Task Data:",task)
    } catch (error) {
      console.error("Error fetching task:", error);
      setError("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getTaskInfo();
    }
  }, []); // Runs when `id` changes

  useEffect(() => {
    console.log("Updated Task State:", task);
    console.log("Task Name: ", task?.name)
  }, [task]); // Logs whenever `task` updates

  // Handle timer updates while running
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerInterval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning, isPaused]); 

  // Save timer state 
  useEffect(() => {
    localStorage.setItem('timer', timer.toString());
    localStorage.setItem('isRunning', JSON.stringify(isRunning));
    localStorage.setItem('isPaused', JSON.stringify(isPaused));

    if (isRunning && !isPaused) {
      // We only want to track elapsed time if the timer is running 
      localStorage.setItem('startTime', Date.now().toString());
    } else {
      localStorage.removeItem('startTime');
    }
  }, [timer, isRunning, isPaused]);

  const handleBack = () => {
    history.replace("/tasklist");
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimer(0);
    localStorage.removeItem('timer');
    localStorage.removeItem('isRunning');
    localStorage.removeItem('isPaused');
  };

  const closeTask = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/closeTask/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }
  
      const data = await response.json();
      console.log("Response Data:", data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const openTask = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/openTask/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }
  
      const data = await response.json();
      console.log("Response Data:", data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>{error}</p>;

  return (
    <IonPage key={forceUpdate}>
      <IonToolbar>
        <IonTitle>View Task</IonTitle>
      </IonToolbar>
      <IonContent className="ion-padding">
        {/* Back button always renders */}
        <IonButton className="back-button" onClick={handleBack}>
          &#8592; {/* Unicode for left arrow */}
        </IonButton>
  
        {/* Show loading state */}
        {loading ? (
          <IonText>Loading task...</IonText>
        ) : task ? (
          // Render task details only when task exists and loading is false
          <div className="content-wrapper">
            <IonText className="task-name">
              <h1>{task.name}</h1>
            </IonText>
            <div className="details-container">
              <IonText className="details">
                <p><strong>Due: </strong>January 29, 2025</p>
                <p><strong>Time Estimate: </strong>{task.total_time_estimate} hours</p>
              </IonText>
              {task.priority !== undefined && (
                <div className="priority-box">P{task.priority}</div>
              )} 
            </div>
            <IonItemDivider />
            <IonText className="description">
              <p><strong>Description:</strong></p>
              <p>
                {task.notes} 
              </p>
            </IonText>
            <IonItemDivider />
            <div className="timer-container">
              <IonText className="timer-display">
                <h2>{new Date(timer * 1000).toISOString().substr(11, 8)}</h2>
              </IonText>
              {/* Timer control buttons */}
              <div className="timer-buttons">
                {isRunning && !isPaused ? (
                  <IonButton className="timer-button" onClick={handlePause}>Pause Task</IonButton>
                ) : isPaused ? (
                  <IonButton className="timer-button" onClick={handleStart}>Resume Task</IonButton>
                ) : (
                  <IonButton className="timer-button" onClick={handleStart}>Start Task</IonButton>
                )}
    
                {/* Show Stop button only when the timer has started */}
                {(isRunning || isPaused) && (
                  <IonButton className="timer-button" onClick={handleStop} color="danger">Stop Task</IonButton>
                )}
              </div>
            </div>
            <IonItemDivider />
            <div className="completed-container">
              <IonText className="completed-label">
                <p><strong>Completed:</strong></p>
              </IonText>
              <input type="checkbox" className="completed-checkbox" />
            </div>
          </div>
        ) : (
          // Show error message if task is missing
          <IonText>Error: Task not found</IonText>
        )}
      </IonContent>
    </IonPage>
  );  
};

export default ViewTask;
