import React, { useState, useEffect } from 'react';
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
  IonBackButton,
  IonIcon,
} from "@ionic/react";
import { closeOutline } from 'ionicons/icons';

import { NewTask, CurrentTask } from '../interfaces/TaskInterface';
import { Course } from '../interfaces/CourseInterface';
import { Tag } from '../interfaces/TagInterface';

import {
  getTomorrowBeforeMidnight,
  getInTwoYears,
  formatLocalDateForIonDatetime
} from '../utils/HandleDatetime';

export const CreateTask: React.FC = () => {
  const { uid } = useAuth();
  const history = useHistory();

  const currentTask: CurrentTask = {
    name: '',
    notes: '',
    location: '',

    due_datetime: getTomorrowBeforeMidnight(),
    total_time_estimate: 1,

    course_id: null,
    tags: [],
  };

  const handleCreate = async (taskData: CurrentTask) => {
    try {
      const newTask: NewTask = {
        user_id: uid,

        name: taskData.name,
        notes: taskData.notes,
        location: taskData.location,
        due_datetime: taskData.due_datetime,

        course_id: taskData.course_id,
        tags: taskData.tags,

        next_start_time: null,
        next_end_time: null,
        time_spent: 0,
        total_time_estimate: taskData.total_time_estimate,

        completed: false,
      };

      const response = await fetch("http://localhost:5050/api/createTasks/addnewtask", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( newTask ),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error storing task, fetching from API: ", data.error);
      } else {
        console.log("Task successfully added:", data);
        history.push("/tasklist");
      }
    } catch (error) {
      console.error("Error connecting to the API: ", error);
    }
  }

  return <TaskForm mode="create" prevTaskData={currentTask} onSubmit={handleCreate} />;
};


interface EditTaskProps {
  params: {
    id: string;
  };
}

export const EditTask: React.FC <EditTaskProps>= ({ params }) => {
  const history = useHistory();
  const [ taskData, setTaskData ] = useState<CurrentTask | null>(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);

  const getTaskData = async () => {
    console.log(`Fetching task with ID: ${params.id}`);
    try {
      const response = await fetch(`http://localhost:5050/api/viewTask/getTask/${params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const data = await response.json();

      const currentTask: CurrentTask = {
        name: data.task.name,
        notes: data.task.notes,
        location: data.task.location,

        due_datetime: new Date(data.task.due_datetime),
        course_id: data.task.course_id,

        tags: data.task.tags,

        total_time_estimate: data.task.total_time_estimate,
      };

      console.log("Current Task:", currentTask);
      setTaskData(currentTask);
    } catch (error) {
      console.error("Error fetching task:", error);
      setError("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTaskData();
  }, [params.id]);

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>{error}</p>;

  if (!taskData) {
    return <p>Task data not found</p>;
  }

  const handleEdit = async (updatedTaskData: CurrentTask) => {
    try {
      console.log("Sending updated task data:", updatedTaskData);
      const response = await fetch(`http://localhost:5050/api/createTasks/updatetask/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( updatedTaskData ),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error updating task: ", data.error);
      } else {
        console.log("Task successfully updated:", data);
        history.push(`/viewtask/${params.id}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return <TaskForm mode="edit" prevTaskData={taskData} onSubmit={handleEdit} />;
};


interface TaskFormProps {
  mode: 'create' | 'edit';
  prevTaskData: CurrentTask;
  onSubmit: (updatedTaskData: CurrentTask) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ mode, prevTaskData, onSubmit }) => {
  const [ taskData, setTaskData ] = useState<CurrentTask>(prevTaskData);

  const [ invalidTaskMessage, setInvalidTaskMessage ] = useState<string>();
  const [ autoSchedule, setAutoSchedule ] = useState<boolean>(true);

  const handleInputChange = (e: IonInputCustomEvent<InputChangeEventDetail>,
                             field: keyof CurrentTask, maxLength: number) => {
    const stringInputFields: (keyof CurrentTask)[] = ["name", "notes", "location"];
    const numberInputFields: (keyof CurrentTask)[] = ["total_time_estimate"];

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

  const handleSelectionChange = (e: IonSelectCustomEvent<SelectChangeEventDetail>, field: keyof CurrentTask) => {
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
    history.back();
  };

  const isTaskValid = () => {
    // [Required fields]: name, course (other fields have valid defaults)
    const required: (keyof CurrentTask)[] = ['name'];
    const missing: string[] = required.filter(field => !taskData[field] ||
      (typeof taskData[field] === 'string' && taskData[field].trim() === ''));

    if (missing.length > 0) {
      let message = missing.map(field => `<${field[0].toUpperCase() + field.slice(1)}>`).join(' and ');
      message += missing.length > 1 ? ' are required!' : ' is required!';
      setInvalidTaskMessage(message);
      console.error(message);
      return false;
    }
    return true;

    // TODO: if date is too far into future, give popup
  };

  const handleSubmit = async () => {
    if (isTaskValid()) {
      console.log("Storing task: ", taskData);
      onSubmit(taskData);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton slot="start" onClick={handleBack}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>{mode === "create" ? "Create" : "Edit"} Task</IonTitle>
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
            max={formatLocalDateForIonDatetime(getInTwoYears())}
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
            <IonButton shape="round" className="create-task-button" onClick={handleSubmit}>
              {mode === "create" ? "Create" : "Update"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
};