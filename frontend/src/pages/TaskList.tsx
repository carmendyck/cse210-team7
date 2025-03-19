import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonDatetime,
  IonText,
  IonIcon
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DatetimeChangeEventDetail, IonDatetimeCustomEvent } from "@ionic/core";
import './TaskList.css';
import { TaskListItem, WorktimeItem } from '../interfaces/TaskListItemInterface';
import CreateTaskButton from "../components/CreateTaskButton";
import { timeOutline } from 'ionicons/icons';


function formatDueDate(dueDatetime: string): string {
  const date = new Date(dueDatetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskListItem[]>([])
  const [worktimes, setWorktimes] = useState<WorktimeItem[]>([])
  const history = useHistory();
  const { logout } = useAuth();
  const { uid } = useAuth();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // e.g. "2025-02-23"
  });

  // TODO: associate priority with color.
  // this is here since priority hasn't been implemented yet,
  // and database has no color field
  const defaultColor = "green";

  const selectTask = (taskId: string) => {
    console.log("Moved to viewtask");
    history.push(`/viewtask/${taskId}`);
  };

  // TODO: Connect to backend
  // + possibly move to bottom (checked) instead of making it disappear from list
  // const removeTask = (taskId: string) => {
  //   const updatedTasks = tasks.filter(task => task.id !== taskId); // Filter out the selected task
  //   setTasks(updatedTasks); // Update the state to remove the task
  // };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const getAllTasks = async () => {
    try {
      console.log("fetching tasks for uid ", uid);
      const response = await fetch(`http://localhost:5050/api/tasklist/getAllTasks/${uid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error fetching tasks: ", data.error || 'Unknown error');
        throw new Error("Failed to fetch task");
      }

      console.log(data.message);

      const taskList : TaskListItem[] = data.tasks;
      setTasks(taskList);
      console.log("Task List:", taskList);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  const removeTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/closeTask/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const data = await response.json();
      console.log("Response Data:", data);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (error) {
      console.error("Error closing task:", error);
    }
  };

  const openTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/openTask/${taskId}`, {
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

  const handleCheckboxChange = async (taskId: string, completed: boolean) => {
    try {
      if (completed) {
        await openTask(taskId);
      } else {
        await removeTask(taskId);
      }

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };


  // gets tasks once on page load
  // TODO: figure out why this is getting called 4 times
  useEffect(() => {
    getAllTasks();
  }, []);

  const getWorktimes = async () => {
    try {
      console.log("fetching worktimes for uid ", uid);
      const response = await fetch(`http://localhost:5050/api/worktimes/getworktimes/${uid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error fetching worktimes: ", data.error || 'Unknown error');
        throw new Error("Failed to fetch worktimes");
      }

      console.log(data.message);

      const worktimeList : WorktimeItem[] = data.worktimes;
      setWorktimes(worktimeList);
      console.log("Worktimes List:", worktimeList);

    } catch (error) {
      console.error("Error fetching worktimes:", error);
    }
  }

  useEffect(() => {
    getWorktimes();
  }, []);

  const handleDateChange = (e: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) => {
    const value = e.detail.value;
    if (typeof value === "string") {
      const dateOnly = value.split('T')[0]; // "YYYY-MM-DD"
      setSelectedDate(dateOnly);
      console.log("Selected date: ", dateOnly);
    }
  };

  const worktimesOnDay = worktimes.filter(worktime => worktime.date === selectedDate)
  console.log("Worktimes on " + selectedDate + ": " + worktimesOnDay);

  const unfinishedTasks = tasks.filter(task => !task.completed && formatDueDate(task.due_datetime.toLocaleString()) === selectedDate);
  const finishedTasks = tasks.filter(task => task.completed && formatDueDate(task.due_datetime.toLocaleString()) === selectedDate);

  // Check if there are any tasks for the selected date (for add button positioning)
  const hasTasksForDate = unfinishedTasks.length > 0 || finishedTasks.length > 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task List</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        <IonItem lines="none" className="centered-datetime-item">
          <IonDatetime
            presentation="date"
            preferWheel={true}
            mode="ios"
            value={selectedDate}
            onIonChange={handleDateChange}
            className="my-datetime"
          />
        </IonItem>

        {/* Worktimes */}
        {worktimesOnDay.length > 0 && (
          <>
            <h2 className="section-title">Suggested Work Schedule</h2>
            <IonList>
              {worktimesOnDay.map((worktime) => (
                <IonItem
                  key={worktime.task_id}
                  className={`task-item ${defaultColor}`}
                  onClick={() => selectTask(worktime.task_id._path.segments[1])}
                >
                  <IonCheckbox
                    slot="start"
                    onClick={(e) => e.stopPropagation()}
                    // onIonChange={() => handleCheckboxChange(task.id, task.completed)}
                  />
                  <IonLabel>
                    <h2><IonIcon icon={timeOutline}></IonIcon> Work on {worktime.task_name}</h2>
                    <p className="due-date">Due: {formatDueDate(worktime.task_due_date.toLocaleString())}</p>
                  </IonLabel>
                  <span className="duration">{worktime.hours}</span>
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        {/* Unfinished Tasks */}
        {unfinishedTasks.length > 0 && (
          <>
            <h2 className="section-title">Unfinished</h2>
            <IonList>
              {unfinishedTasks.map((task) => (
                <IonItem
                  key={task.id}
                  className={`task-item ${defaultColor}`}
                  onClick={() => selectTask(task.id)}
                >
                  <IonCheckbox
                    slot="start"
                    onClick={(e) => e.stopPropagation()}
                    onIonChange={() => handleCheckboxChange(task.id, task.completed)}
                  />
                  <IonLabel>
                    <h2>{task.name}</h2>
                    <p className="due-date">Due: {formatDueDate(task.due_datetime.toLocaleString())}</p>
                  </IonLabel>
                  <span className="duration">{task.total_time_estimate}</span>
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        {/* Finished Tasks */}
        {finishedTasks.length > 0 && (
          <>
            <h2 className="section-title">Finished</h2>
            <IonList>
              {finishedTasks.map((task) => (
                <IonItem
                  key={task.id}
                  className={`task-item ${defaultColor}`}
                >
                  <IonCheckbox
                    slot="start"
                    onClick={(e) => e.stopPropagation()}
                    checked={task.completed}
                    onIonChange={() => handleCheckboxChange(task.id, task.completed)}
                  />
                  <IonLabel>
                    <h2>{task.name}</h2>
                    <p className="due-date">Due: {formatDueDate(task.due_datetime.toLocaleString())}</p>
                  </IonLabel>
                  <span className="duration">{task.total_time_estimate}</span>
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        {/* Add Task Button */}

        {/* CreateTaskButton with conditional positioning */}
        {hasTasksForDate ? (
          // Normal bottom-right position when tasks exist
          <CreateTaskButton vertical="bottom" horizontal="end" />
        ) : (
          // Empty state with message above button
          <>
            <CreateTaskButton vertical="center" horizontal="center" className="centered-fab" />
            <div className="no-tasks-container">
              <IonText className="no-tasks-message">
                No tasks yet for this date!
              </IonText>
            </div>
          </>
        )}

      </IonContent>
    </IonPage>
  );
};

export default TaskList;

