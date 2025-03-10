import React, { useState, useEffect } from 'react';
import { IonButton, IonButtons, IonContent, IonPage, IonTitle, IonToolbar, IonText, IonItemDivider, IonSpinner, IonModal, IonItem, IonLabel, IonInput, IonHeader } from "@ionic/react";
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
  const [task, setTask] = useState<{ name: string, notes: string, total_time_estimate: number, priority: number, completed: boolean, due_datetime: string, time_spent: number } | null>(null); // Ensure correct type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkboxLoading, setCheckboxLoading] = useState(false);
  const [loadingTimeSpent, setLoadingTimeSpent] = useState(false);
  const [anotherTaskRunning, setAnotherTaskRunning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [manualHours, setManualHours] = useState<number | null>(null);
  const [manualMinutes, setManualMinutes] = useState<number | null>(null);

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

  // Check if another task's timer is running
  useEffect(() => {
    const taskInProgress = JSON.parse(localStorage.getItem('isRunning') || "false") ||
                          JSON.parse(localStorage.getItem('isPaused') || "false"); // parse it as a bool
    const runningTaskId = localStorage.getItem('runningTaskId');
    if (taskInProgress === true && runningTaskId && runningTaskId !== params.id) {
      setAnotherTaskRunning(true);
    } else {
      setAnotherTaskRunning(false);
    }
    console.log("Task running:", runningTaskId);
    console.log("This task:", params.id)
  }, [params.id]);

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

  // Set timer state
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

  const handleEdit = () => {
    history.push({
      pathname: `/edittask/${params.id}`,
      state: { task },
    });
  };

  // Timer start/resume
  const handleStart = () => {
    localStorage.setItem('runningTaskId', params.id);
    localStorage.setItem('runningTaskName', task?.name ?? "None");

    setIsRunning(true);
    setIsPaused(false);
  };

  // Timer pause
  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  // Timer stop - opens modal to handle time checking/editing
  const handleStop = async () => {
    // Pause timer in case they hit cancel in the modal
    handlePause()

    // Set modal values from timer
    const additionalTime = timer / 3600; // Convert seconds to hours
    setManualHours(Math.floor(additionalTime))
    setManualMinutes(Math.round((additionalTime % 1) * 60))

    // Pull up modal to confirm time
    setShowModal(true)
  };

  // Submit clicked
  const handleManualTimeSubmit = async () => {
    // Update the time
    const additionalTime = (manualHours ?? 0) + (manualMinutes ?? 0) / 60;
    await updateTimeSpent(additionalTime);

    // Reset any timer
    setIsRunning(false);
    setIsPaused(false);
    setTimer(0);
    localStorage.removeItem('timer');
    localStorage.removeItem('isRunning');
    localStorage.removeItem('isPaused');
    localStorage.removeItem('runningTaskId');
    localStorage.removeItem('runningTaskName');

    // Reset modal values
    setManualHours(null)
    setManualMinutes(null)

    // Close modal
    setShowModal(false);
  };

  const handleModalCancel = () => {
    // Reset modal values
    setManualHours(null)
    setManualMinutes(null)

    // Close modal
    setShowModal(false)
  }

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

  // DB call for updating time spent
  const updateTimeSpent = async (additionalTime: number) => {
    setLoadingTimeSpent(true)

    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/updateTimeSpent/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ additionalTime }),
      });

      if (!response.ok) {
        throw new Error("Failed to update time spent");
      }

      const data = await response.json();
      console.log("Response Data:", data);

      // Update local state to reflect the new time_spent, ensuring 2 decimals
      setTask(prevTask => prevTask ? { ...prevTask, time_spent: parseFloat(data.newTimeSpent.toFixed(2)) } : null);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoadingTimeSpent(false); // Hide loading indicator
    }
  };

  // Task completed checked/unchecked
  const handleCheckboxChange = async () => {
    setCheckboxLoading(true)
    if (task?.completed) {
      await openTask();
      setTask(prevTask => prevTask ? { ...prevTask, completed: false } : null);
    } else {
      await closeTask();
      setTask(prevTask => prevTask ? { ...prevTask, completed: true } : null);
    }
    setCheckboxLoading(false)
  };

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>{error}</p>;

  return (
    <IonPage key={forceUpdate}>
      <IonHeader>
        <IonToolbar>
            {/* Back button always renders */}
            <IonButtons slot="start">
              <IonButton className="back-button" onClick={handleBack}>
                  &#8592; {/* Unicode for left arrow */}
              </IonButton>
            </IonButtons>
            <IonTitle>View Task</IonTitle>
            <IonButtons slot="end">
              <IonButton className="edit-button" onClick={handleEdit}>
                Edit
              </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
                <p><strong>Due: </strong>{new Date(task.due_datetime).toLocaleString("en-US", {
                  year: "numeric",  // "2025"
                  month: "long",    // "February"
                  day: "numeric",   // "23"
                  hour: "2-digit",  // "11 AM"
                  minute: "2-digit",// "59"
                  hour12: true      // AM/PM format
                })}</p>
                <p><strong>Time Estimated: </strong>{task.total_time_estimate} hours</p>
                <p><strong>Time Spent: </strong>{task.time_spent.toFixed(2)} {task.time_spent === 1 ? "hour" : "hours"}</p>
              </IonText>
              {task.priority !== undefined && (
                <div className="priority-box">P{task.priority}</div>
              )}
            </div>
            <IonItemDivider className="ion-item-divider"/>
            <IonText className="description">
              <p><strong>Description:</strong></p>
              <p>
                {task.notes}
              </p>
            </IonText>
            <IonItemDivider className="ion-item-divider"/>
            <div className="timer-container">
              {/* Loading Overlay */}
              {loadingTimeSpent && (
                <div className="loading-overlay">
                  <IonSpinner name="circles" />
                </div>
              )}
              {/* Timer */}
              <IonText className={`timer-display ${anotherTaskRunning ? 'disabled-timer' : ''}`}>
                <h2>{anotherTaskRunning ? '00:00:00' : new Date(timer * 1000).toISOString().substr(11, 8)}</h2>
              </IonText>
              {/* Timer control buttons */}
              <div className="timer-buttons">
              {anotherTaskRunning ? (
                  <IonText className="another-task-message">You have a task in progress: <strong>{localStorage.getItem('runningTaskName')}</strong>.
                  Please stop it before starting this task.</IonText>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
            {/* Manual time entry */}
            <IonItemDivider className="ion-item-divider"/>
            <div title={anotherTaskRunning ? "Please stop the other task to enter time." : ""}>
              <IonButton 
                className="manual-time" 
                onClick={() => setShowModal(true)}
                disabled={anotherTaskRunning}
              >
                Enter Time Manually
              </IonButton>
            </div>
            {/* "Completed" checkbox */}
            <IonItemDivider className="ion-item-divider"/>
            <div className="completed-container">
              <IonText className="completed-label">
                <p><strong>Task Completed:</strong></p>
              </IonText>
              {checkboxLoading ? (
                <IonSpinner name="circles" />
              ) : (
                <input
                  type="checkbox"
                  className="completed-checkbox"
                  checked={task.completed}
                  onChange={handleCheckboxChange}
                />
              )}
            </div>
          </div>
        ) : (
          // Show error message if task is missing
          <IonText>Error: Task not found</IonText>
        )}

        {/* Modal for entering time manually */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="manual-time-modal">
          <IonContent className="ion-padding">
            <IonItem>
              <IonText><strong>Time Spent:</strong></IonText>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Hours</IonLabel>
              <IonInput
                type="number"
                inputmode="numeric"
                min="0"
                step="1"
                value={manualHours}
                onIonChange={e => {
                  const value = parseInt(e.detail.value!, 10);
                  setManualHours(isNaN(value) || value < 0 ? 0 : value);
                }}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Minutes</IonLabel>
              <IonInput
                type="number"
                inputmode="numeric"
                min="0"
                max="59"
                step="1"
                value={manualMinutes}
                onIonChange={e => {
                  const value = parseInt(e.detail.value!, 10);
                  setManualMinutes(isNaN(value) || value < 0 ? 0 : value);
                }}
              />
            </IonItem>
            <IonButton expand="block" color="secondary" onClick={handleManualTimeSubmit}>Submit</IonButton>
            <IonButton expand="block" color="light" onClick={handleModalCancel}>Cancel</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ViewTask;
