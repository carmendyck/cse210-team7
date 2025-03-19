import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  InputChangeEventDetail,
  IonInputCustomEvent,
  DatetimeChangeEventDetail,
  IonDatetimeCustomEvent,
  IonSelectCustomEvent,
  SelectChangeEventDetail,
  IonToggleCustomEvent,
  ToggleChangeEventDetail,
  IonRangeCustomEvent,
  RangeChangeEventDetail
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
  IonIcon,
  IonRange,
  IonLabel,
} from "@ionic/react";
import { closeOutline } from 'ionicons/icons';

import { NewTask, CurrentTask, FullQueriedTask } from '../interfaces/TaskInterface';
import { Course } from '../interfaces/CourseInterface';
import { Tag } from '../interfaces/TagInterface';
import axios from "axios";

import {
  getTomorrowBeforeMidnight,
  getInTwoYears,
  formatLocalDateForIonDatetime
} from '../utils/HandleDatetime';

export const CreateTask: React.FC = () => {
  const { uid } = useAuth();
  const { user } = useAuth();
  const history = useHistory();

  const currentTask: CurrentTask = {
    name: '',
    notes: '',
    location: '',

    due_datetime: getTomorrowBeforeMidnight(),
    total_time_estimate: 1,
    priority: 0,

    course_id: "",
    tags: [],
  };

  const handleCreate = async (taskData: CurrentTask): Promise<string | undefined> => {
    try {
      const newTask: NewTask = {
        user_id: uid,
        name: taskData.name,
        notes: taskData.notes,
        location: taskData.location,
        due_datetime: taskData.due_datetime,
        priority: taskData.priority,
        course_id: taskData.course_id,
        tags: taskData.tags,

        time_spent: 0,
        total_time_estimate: taskData.total_time_estimate,
        completed: false,
      };

      const response = await fetch("http://localhost:5050/api/createTasks/addnewtask", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error storing task, fetching from API:", data.error);
        return undefined;
      } else {
        console.log("Task successfully added:", data);
        return data["taskId"] ?? undefined;
      }
    } catch (error) {
      console.error("Error connecting to the API:", error);
      return undefined;
    }
  };


  return <TaskForm mode="create" prevTaskData={currentTask} onSubmit={handleCreate} />;
};


interface EditTaskProps {
  params: {
    id: string;
  };
}

interface LocationState {
  task: FullQueriedTask;
}

export const EditTask: React.FC <EditTaskProps>= ({ params }) => {
  const history = useHistory();
  const location = useLocation<{ state: LocationState }>();

  // @ts-ignore
  const task = location.state?.task; // VSCode typing has incorrect error
  const [ taskData, setTaskData ] = useState<CurrentTask | null>(null);

  useEffect(() => {
    console.log("Loading task data from View Task into Edit Task...")
    if (task) {
      const currentTask: CurrentTask = {
        name: task.name,
        notes: task.notes,
        location: task.location,
        due_datetime: new Date(task.due_datetime),
        priority: task.priority,
        course_id: task.course_id,
        tags: task.tags,
        total_time_estimate: task.total_time_estimate,
      };
      console.log("Loaded in task data: ", currentTask);
      setTaskData(currentTask);
    }
  }, [task]);

  if (!taskData) {
    return <p>Task data not found</p>;
  }

  const handleEdit = async (updatedTaskData: CurrentTask) : Promise<string | undefined> => {
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
        return undefined;
      } else {
        console.log("Task successfully updated:", data);
        return data["taskId"] ?? undefined;
        //history.push(`/viewtask/${params.id}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      return undefined;
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
  const [ courseOptions, setCourseOptions ] = useState<Course[]>([]);

  const [ invalidTaskMessage, setInvalidTaskMessage ] = useState<string>();
  const [ taskId, setTaskId ] = useState<string>();
  const [ autoSchedule, setAutoSchedule ] = useState<boolean>(true);
  const [ givingAutoSchedule, setGivingAutoSchedule ] = useState<boolean>(false);

  const { uid } = useAuth();
  const { user } = useAuth();
  const history = useHistory();

  const getTaskEstimate = async (task_id : string) => {
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
  };

  const handleMakeSchedule = async () => {
    if (!uid) {
      console.error("User not logged in");
      return;
    }

    console.log("Generating schedule...");
    try {
      const response = await axios.get(`http://localhost:8000/auto-schedule/${uid}`, {
        headers: { "Authorization": `Bearer ${user}` },
      });
      console.log("Generated schedule successfully:", response.data);
    } catch (error) {
      console.error("Error generating scehdule:", error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/courseSelect/getAllCourses/${uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourseOptions(data.courses); // Assuming API returns { courses: [{ id, name }, ...] }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

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

  const handlePriorityChange = (e: IonRangeCustomEvent<RangeChangeEventDetail>) => {
    let value = Number(e.detail.value);
    if (value < 0 && value > 2) {
      console.warn(`Priority value ${value} must be between [0, 2]!`);
      value = 0;
    }
    setTaskData({ ...taskData, priority: value, });
    console.log("Field [ priority ] set to [", value, "]");
  };

  const handleAutoScheduleChange = (e: IonToggleCustomEvent<ToggleChangeEventDetail>) => {
    setAutoSchedule(e.detail.checked);
    console.log("Auto-schedule:", autoSchedule);
  };

  const handleBack = () => {
    history.push("/tasklist");
  };

  const isTaskValid = () => {
    // [Required fields]: name, course (other fields have valid defaults)
    const required: (keyof CurrentTask)[] = ['name', 'course_id'];
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
      const task_id = await onSubmit(taskData);
      await handleMakeSchedule();

      if (!autoSchedule) {
        history.push("/tasklist");
      } else {
        if (task_id) {
          setTaskId(task_id);
        }
        console.log(`our task id is: ${task_id}`)
        await getTaskEstimate(task_id);
        setGivingAutoSchedule(true)
      }
    }
  };

  const handleAcceptTimeEst = async () => {
    if (isTaskValid()) {
      console.log("Storing task: ", taskData);

      try {
        console.log("Sending updated task data:", taskData);
        const response = await fetch(`http://localhost:5050/api/createTasks/updatetask/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify( taskData ),
        });

        const data = await response.json();

        if (!response.ok) {
          console.log("Error updating task: ", data.error);
        } else {
          console.log("Task successfully updated:", data);
          await handleMakeSchedule();
          history.push("/tasklist");
          //history.push(`/viewtask/${params.id}`);
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
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
      {!givingAutoSchedule ? (
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

        <IonItem>
          <IonDatetime
            value={formatLocalDateForIonDatetime(taskData.due_datetime)}
            min={formatLocalDateForIonDatetime(new Date())}
            max={formatLocalDateForIonDatetime(getInTwoYears())}
            onIonChange={(e) => handleDueDateChange(e)}>
            <span slot="title">Due date/time</span>
          </IonDatetime>
        </IonItem>

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

        <IonItem>
          <IonSelect label="Course" value={taskData.course_id} onIonChange={(e) => handleSelectionChange(e, 'course_id')} placeholder="Course">
            {courseOptions.filter(course => course.course_name != "NULL").map((course) => (
              <IonSelectOption key={course.id} value={`courses/${course.id}`}>
                {course.course_name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonRange label="Priority"
            ticks={true} snaps={true}
            min={0} max={2}
            value={taskData.priority}
            onIonChange={(e) => handlePriorityChange(e)}>
            <IonLabel slot="start">high</IonLabel>
            <IonLabel slot="end">low</IonLabel>
          </IonRange>
        </IonItem>

        {/* Scheduling and time */}
        <IonItem>
          {/* Show loading state */}
          {!autoSchedule ? (
          <IonInput value={taskData.total_time_estimate}
            onIonInput={(e) => handleInputChange(e, 'total_time_estimate', Infinity)}
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
    ) :
    <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
      <IonItem>
        <p>
          The time estimate for your task is:
        </p>
        </IonItem>
        <IonItem>
        <IonInput value={taskData.total_time_estimate}
          onIonChange={(e) => handleInputChange(e, 'total_time_estimate', Infinity)}
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
            <IonButton shape="round" onClick={handleAcceptTimeEst}>Accept</IonButton>
          </IonButtons>
        </IonToolbar>
    </IonContent>}
    </IonPage>
  );
};