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

const CreateTask: React.FC = () => {
  const user = useAuth();
  const history = useHistory();

  // Functions for working with datetimes
  const getTomorrowBeforeMidnight = (): Date => {
    const dueDateTime = new Date();
    dueDateTime.setDate(dueDateTime.getDate() + 1);
    dueDateTime.setHours(23, 59, 59, 999);
    return dueDateTime;
  };

  const formatLocalDateForIonDatetime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  // Storing constants to be used upon task creation
  const [ taskData, setTaskData ] = useState<NewTask>({
    // Basic info
    user_id: "aNlyq8aiGeS8VmMGzjjDuugSBXy2",//user.uid,

    name: null,
    notes: null,
    location: null,  // (optional)
    due_datetime: getTomorrowBeforeMidnight(),

    // To filter data
    course_id: "48XHCzjPwb3i4BS3fk6X",
    tags: [],

    // Time/completion (optional)
    next_start_time: null,
    next_end_time: null,

    time_spent: 0,
    total_time_estimate: 1,

    completed: false,
  });

  const [ autoSchedule, setAutoSchedule ] = useState<boolean>(true);

  const [ invalidTaskMessage, setInvalidTaskMessage ] = useState<string>();

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

  const handleCreate = async () => {
    // [Required fields]: name, course (other fields have valid defaults)
    const required: (keyof NewTask)[] = ['name', 'course_id'];
    const missing: string[] = [];
      required.forEach((field) => {
        if (taskData[field] == null) {
          missing.push(`<${field[0].toUpperCase() + field.slice(1)}>`);
        }
      });

    // Task validation-- make sure required fields are completed
    if (missing.length > 0) {
      let message = missing.length > 1 ? missing.join(' and ') : missing[0];
      let verb = missing.length > 1 ? "are" : "is";
      message = `${message} ${verb} required!`;
      setInvalidTaskMessage(message);
      console.error(message);
      return;
    }
    // TODO: Add storing of task
    console.log("Storing task: ", taskData);
    try {
      const response = await fetch("http://localhost:5050/api/tasks/addnewtask", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( taskData ),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Something went wrong..."); // TODO: more specific error catching
        throw new Error('Unable to create task.');
      } else {
        console.log("Task successfully added!", data);

        // TODO: trigger auto-scheduling
        console.log("Auto schedule? ", autoSchedule);
        history.push("/tasklist");
      }
    } catch (error) {

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

      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        {/* Basic task information */}
        <IonItem>
          <IonInput value={taskData.name} onIonChange={(e) => handleInputChange(e, 'name')}
            label="Name" labelPlacement="fixed" placeholder="Add task name"></IonInput>
        </IonItem>
        <IonItem>
            <IonInput value={taskData.notes} onIonChange={(e) => handleInputChange(e, 'notes')}
              label="Notes" labelPlacement="fixed" placeholder="Add notes"></IonInput>
        </IonItem>
        <IonItem>
            <IonInput value={taskData.location} onIonChange={(e) => handleInputChange(e, 'location')}
              label="Location" labelPlacement="fixed" placeholder="Add location (optional)"></IonInput>
        </IonItem>

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
          <IonInput value={taskData.total_time_estimate}
            onIonChange={(e) => handleInputChange(e, 'total_time_estimate')}
            type="number" label="Time Estimate (hours)" placeholder="1" min="0"></IonInput>
        </IonItem>

        <IonItem>
          {/* TODO: trigger automatic app time estimates */}
          <IonToggle checked={autoSchedule}
            onIonChange={handleAutoScheduleChange}>Auto-scheduling</IonToggle>
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
    </IonPage>
  );
};

export default CreateTask;