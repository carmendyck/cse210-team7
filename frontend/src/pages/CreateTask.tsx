import React, { useState } from 'react';
import { IonButton, IonFab, IonContent, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { IonInput, IonItem, IonHeader, IonDatetime, IonToggle, IonSelect, IonSelectOption } from "@ionic/react";
import { useHistory } from "react-router-dom";

import { Task, Category } from '../components/TaskInterfaces';

const CreateTask: React.FC = () => {
  const history = useHistory();

  const [taskData, setTaskData] = useState<Task>({
    name: '',
    notes: '',
    due_datetime: null,
    time_estimate: 1,
    category: null,
    worktimes: new Array<Date>,
  });

  const handleBack = () => {
    history.push("/tasklist"); // Redirects to the main app
  };

  const handleSave = () => {
    // TODO: Add storing of task
    history.push("/tasklist");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Task</IonTitle>
          <IonButton size="small" onClick={handleBack}>X</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonItem>
          <IonInput value={taskData.name}
          label="Name" labelPlacement="stacked" placeholder="Enter task name..."></IonInput>
        </IonItem>
        <IonItem>
            <IonInput value={taskData.notes}
            label="Notes" labelPlacement="stacked" placeholder="Enter notes..."></IonInput>
        </IonItem>

        <IonItem>
          <IonDatetime value={taskData.due_datetime ? taskData.due_datetime.toISOString() : ''}>
            <span slot="title">Due date/time</span>
          </IonDatetime>
        </IonItem>

        <IonItem>
          <IonInput value={taskData.time_estimate}
          type="number" label="Time Estimate (hours)" placeholder="1" min="0"></IonInput>
        </IonItem>

        <IonItem>
          {/* TODO: import categories from account preferences */}
          <IonSelect value={taskData.category} label="Category" placeholder="Category" multiple={false}>
            <IonSelectOption value="MATH 100">Abstract Alg.</IonSelectOption>
            <IonSelectOption value="CSE 210">SWE Principles</IonSelectOption>
            <IonSelectOption value="CSE 141">Comp. Arch.</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          {/* TODO: trigger automatic app time estimates */}
          <IonToggle checked={true}>Auto-scheduling</IonToggle>
        </IonItem>

        {/* TODO: add worktime inputs */}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonButton shape="round" onClick={handleSave}>Save</IonButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default CreateTask;