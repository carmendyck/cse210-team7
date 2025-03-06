import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  InputChangeEventDetail,
  IonInputCustomEvent,
  DatetimeChangeEventDetail,
  IonDatetimeCustomEvent,
  IonSelectCustomEvent,
  SelectChangeEventDetail,
  IonToggleCustomEvent,
  ToggleChangeEventDetail
} from '@ionic/core';

import {
  IonButton,
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonHeader,
  IonDatetime,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonText,
} from "@ionic/react";

import { NewTask } from '../interfaces/TaskInterface';
import { Course } from '../interfaces/CourseInterface';
import { Tag } from '../interfaces/TagInterface';
import axios from "axios";

import { getTomorrowBeforeMidnight, formatLocalDateForIonDatetime }  from '../components/HandleDatetime';

const CreateTask: React.FC = () => {
  const { uid } = useAuth();
  const { user } = useAuth()
  const history = useHistory();

  // Storing constants to be used upon task creation
  const [ taskData, setTaskData ] = useState<NewTask>({
    // Basic info
    user_id: uid,

    name: null,
    notes: null,
    location: null,  // (optional)
    due_datetime: getTomorrowBeforeMidnight(),

    // To filter data
    course_id: "/course/9s6jfTgFP323GCOjTdXy", // TODO: Update once course preferences are linked to database
    tags: [],

    // Time/completion (optional)
    next_start_time: null,
    next_end_time: null,

    time_spent: 0,
    total_time_estimate: 1,

    completed: false,
  });

  const [ autoSchedule, setAutoSchedule ] = useState<boolean>(true);
  const [ givingAutoSchedule, setGivingAutoSchedule ] = useState<boolean>(false);

  const [ invalidTaskMessage, setInvalidTaskMessage ] = useState<string>();
  const [ taskId, setTaskId ] = useState<string>();

  const getTaskEstimate = async (task_id : string) => {
    if (!uid) {
      console.error("User not logged in");
      return;
    }
    if (!uid) {
      console.error("User not logged in");
      return;
    }

    try {
      // const token = await uid.getIdToken(true);
      const response = await axios.get(`http://localhost:8000/init-task-estimate/${task_id}`, {
        headers: { "Authorization": `Bearer ${user}` },
      });
  
      console.log("Fetched Task Estimate:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching task estimate:", error);
    }
  }

  // const handleAcceptEstimateButtonClick = async () => {
  //   await getTaskEstimate();
  // }

  // Handling changes to inputs-- updating states
  const handleInputChange = (e: IonInputCustomEvent<InputChangeEventDetail>, field: keyof NewTask) => {
    console.log("Field [", field, "] set to [", e.target.value, "]");
    setTaskData({ ...taskData, [field]: e.target.value, });
  };

  const handleDueDateChange = (e: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) => {
    const value = e.detail.value;
    if (typeof value == "string") {
      const newDate = new Date(value);
      console.log("New due date: ", newDate);
      setTaskData({ ...taskData, due_datetime: newDate });
    } else {
      console.error("Received multiple dates. Multiple date selection should not be allowed.")
    }
  };

  const handleSelectionChange = (e: IonSelectCustomEvent<SelectChangeEventDetail>, field: keyof NewTask) => {
    if (field == 'course_id' || field == 'tags') {
      console.log("Field [", field, "] set to [", e.detail.value, "]");
      setTaskData({ ...taskData, [field]: e.detail.value, });
    } else {
      console.error("Only selections for courses or tags accepted.");
    }
  };

  const handleAutoScheduleChange = (e: IonToggleCustomEvent<ToggleChangeEventDetail>) => {
    console.log("Auto-schedule:", autoSchedule);
    setAutoSchedule(e.detail.checked);
  };

  const handleBack = () => {
    history.push("/tasklist"); // Redirects to the main app
  };

  const isTaskValid = () => {
    // [Required fields]: name, course (other fields have valid defaults)
    const required: (keyof NewTask)[] = ['name'];
    const missing: string[] = required.filter(field => !taskData[field]);

    if (missing.length > 0) {
      let message = missing.map(field => `<${field[0].toUpperCase() + field.slice(1)}>`).join(' and ');
      message += missing.length > 1 ? ' are required!' : ' is required!';
      setInvalidTaskMessage(message);
      console.error(message);
      return false;
    } else {
      return true;
    }
  };

  const handleCreate = async () => {
    if (!isTaskValid()) {
      return;
    }

    // TODO: Add storing of task
    console.log("Storing task: ", taskData);

    try {
      const response = await fetch("http://localhost:5050/api/createTasks/addnewtask", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( taskData ),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error storing task, fetching from API: ", data.error || 'Unknown error');
      } else if (!autoSchedule) {
        console.log("Task successfully added:", data);
        history.push("/tasklist");
      } else {
        console.log("Task successfully added:", data);
        setTaskId(data["taskId"])
        await getTaskEstimate(data["taskId"]);
        setGivingAutoSchedule(true)
      }
    } catch (error) {
      console.error("Error connecting to the API: ", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            slot="start"
            size="small"
            style={{ paddingLeft: '10px', paddingRight: '10px' }}
            onClick={handleBack}>X
          </IonButton>
          <IonTitle>Create Task</IonTitle>
        </IonToolbar>
      </IonHeader>
      {!givingAutoSchedule ? (
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        {/* Basic task information */}
        <IonInput
          value={taskData.name} onIonChange={(e) => handleInputChange(e, 'name')}
          aria-label="Name" labelPlacement="fixed" placeholder="Add task name"
          counter={true} maxlength={50}>
        </IonInput>
        {/* TODO: add Notes icon */}
        <IonInput
          value={taskData.notes} onIonChange={(e) => handleInputChange(e, 'notes')}
          aria-label="Notes" labelPlacement="fixed" placeholder="Add notes (optional)"
          counter={true} maxlength={500}>
        </IonInput>
        {/* TODO: add location icon */}
        <IonInput
          value={taskData.location} onIonChange={(e) => handleInputChange(e, 'location')}
          aria-label="Location" labelPlacement="fixed" placeholder="Add location (optional)"
          counter={true} maxlength={50}>
        </IonInput>
        {/* </IonItem> */}

        <IonItem>
          <IonDatetime
            value={formatLocalDateForIonDatetime(taskData.due_datetime)}
            onIonChange={(e) => handleDueDateChange(e)}>
            <span slot="title">Due date/time</span>
          </IonDatetime>
        </IonItem>

        {/* Course/tags for task */}
        {/* <IonItem> */}
          {/* <IonSelect value={taskData.course_id} */}
            {/* // label="Course" */}
            {/* // placeholder="Course" */}
            {/* // multiple={false} */}
            {/* // onIonChange={(e) => handleSelectionChange(e, 'course_id')}> */}
            {/* TODO: import categories from account preferences */}
            {/* <IonSelectOption value="MATH 100">Abstract Alg.</IonSelectOption> */}
            {/* <IonSelectOption value="CSE 210">SWE Principles</IonSelectOption> */}
            {/* <IonSelectOption value="CSE 141">Comp. Arch.</IonSelectOption> */}
            {/* TODO: add option to add new category? */}
          {/* </IonSelect> */}
        {/* </IonItem> */}

        <IonItem>
          <IonSelect value={taskData.tags}
            label="Tags"
            placeholder="Tags"
            multiple={true}
            onIonChange={(e) => handleSelectionChange(e, 'tags')}>
            {/* TODO: import tags from account preferences */}
            <IonSelectOption value="Assignment">Assignment</IonSelectOption>
            <IonSelectOption value="Quiz">Quiz</IonSelectOption>
            <IonSelectOption value="Exam">Exam</IonSelectOption>
            <IonSelectOption value="Reading">Reading</IonSelectOption>
            {/* TODO: add option to add new tag? */}
          </IonSelect>
        </IonItem>

        {/* Scheduling and time */}
        <IonItem>
          {/* Show loading state */}
          {!autoSchedule ? (
          <IonInput value={taskData.total_time_estimate}
            onIonChange={(e) => handleInputChange(e, 'total_time_estimate')}
            type="number" label="Time Estimate (hours)" placeholder="1" min="0"></IonInput>
          ) : <p>Total Time Estimate will be Automatically Calculated</p>
          }
        </IonItem>

        <IonItem>
          {/* TODO: trigger automatic app time estimates */}
          <IonToggle checked={autoSchedule}
            onIonChange={handleAutoScheduleChange}>Automatic Time Estimation</IonToggle>
        </IonItem>

        {/* TODO: add worktime inputs if no auto-scheduling */}

        <IonToolbar>
          {invalidTaskMessage && (
            <IonText color="danger">
              <p>{invalidTaskMessage}</p>
            </IonText>
          )}

          <IonButtons slot="primary">
            <IonButton shape="round" onClick={handleCreate}>Create</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonContent>
    ) : 
    <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
      <IonItem>
        <p>
          The time estimate for your task is:
        </p>
        </IonItem>
        <IonItem>
        <IonInput value={taskData.total_time_estimate}
          onIonChange={(e) => handleInputChange(e, 'total_time_estimate')}
          type="number" label="Time Estimate (hours):" min="0">
        </IonInput>
      </IonItem>
      <IonItem>
        <p>
          Either change it above, or accept it by pressing "accept"
        </p>
      </IonItem>
      <IonToolbar>
          <IonButtons slot="primary">
            <IonButton shape="round">Accept</IonButton>
          </IonButtons>
        </IonToolbar>
    </IonContent>}
    </IonPage>
  );
};

export default CreateTask;