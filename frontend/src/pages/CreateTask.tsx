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

import { getTomorrowBeforeMidnight, formatLocalDateForIonDatetime }  from '../utils/HandleDatetime';

const CreateTask: React.FC = () => {
  const { uid } = useAuth();
  const history = useHistory();

  // Storing constants to be used upon task creation
  const [ taskData, setTaskData ] = useState<NewTask>({
    // Basic info
    user_id: uid,

    name: '',
    notes: '',
    location: '',  // (optional)
    due_datetime: getTomorrowBeforeMidnight(),

    // To filter data
    course_id: null, // TODO: Update once course preferences are linked to database
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

  const handleInputChange = (e: IonInputCustomEvent<InputChangeEventDetail>,
                             field: keyof NewTask, maxLength: number) => {
    const stringInputFields: (keyof NewTask)[] = ["name", "notes", "location"];
    const numberInputFields: (keyof NewTask)[] = ["total_time_estimate"];

    let newValue: any = String(e.target.value) || '';
    console.log('Input value [', newValue, '] with type [', typeof newValue, ']');

    // String input fields must be under max character limit
    if (stringInputFields.includes(field)) {
      if (newValue.length > maxLength) {
        console.warn(`Input length ${newValue.length} must be less than ${maxLength}!`);
        newValue = newValue.slice(0, maxLength);
      }
    // Total time estimate must be non-negative
    } else if (numberInputFields.includes(field)) {
      newValue = Number(newValue);
      if (newValue < 0) {
        console.warn(`Input value ${newValue} must be greater than or equal to ${0}!`);
        newValue = 0;
      }
    }
    setTaskData({ ...taskData, [field]: newValue, });
    console.log("Field [", field, "] set to [", newValue, "]");
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
    const missing: string[] = required.filter(field => !taskData[field] ||
      (typeof taskData[field] === 'string' && taskData[field].trim() === ''));

    if (missing.length > 0) {
      let message = missing.map(field => `<${field[0].toUpperCase() + field.slice(1)}>`).join(' and ');
      message += missing.length > 1 ? ' are required!' : ' is required!';
      setInvalidTaskMessage(message);
      console.error(message);
      return false;
    } else {
      return true;
    }

    // TODO: if date is too far into future, give popup
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
      } else {
        console.log("Task successfully added:", data);
        history.push("/tasklist");
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

      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        {/* Basic task information */}
        <IonInput
          value={taskData.name} onIonInput={(e) => handleInputChange(e, 'name', 50)}
          aria-label="Name" labelPlacement="fixed" placeholder="Add task name"
          counter={true} maxlength={50}>
        </IonInput>
        {/* TODO: add Notes icon */}
        <IonInput
          value={taskData.notes} onIonInput={(e) => handleInputChange(e, 'notes', 500)}
          aria-label="Notes" labelPlacement="fixed" placeholder="Add notes (optional)"
          counter={true} maxlength={500}>
        </IonInput>
        {/* TODO: add location icon */}
        <IonInput
          value={taskData.location} onIonInput={(e) => handleInputChange(e, 'location', 50)}
          aria-label="Location" labelPlacement="fixed" placeholder="Add location (optional)"
          counter={true} maxlength={50}>
        </IonInput>
        {/* </IonItem> */}

        <IonItem>
          <IonDatetime
            value={formatLocalDateForIonDatetime(taskData.due_datetime)}
            min={formatLocalDateForIonDatetime(new Date())}
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
            <IonSelectOption value="Paper">Paper</IonSelectOption>
            {/* TODO: add option to add new tag? */}
          </IonSelect>
        </IonItem>

        {/* Scheduling and time */}
        <IonItem>
          <IonInput value={taskData.total_time_estimate}
            onIonInput={(e) => handleInputChange(e, 'total_time_estimate', Infinity)}
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
            <IonText color="danger" className="invalid-task-message">
              <p>{invalidTaskMessage}</p>
            </IonText>
          )}

          <IonButtons slot="primary">
            <IonButton shape="round" className="create-task-button" onClick={handleCreate}>Create</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
};

export default CreateTask;