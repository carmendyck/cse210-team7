import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSegment, IonSegmentButton,IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Course } from '../interfaces/CourseInterface';
import React, { useState } from 'react';

import {
  InputChangeEventDetail,
  IonInputCustomEvent,
} from '@ionic/core';


const CreateAccountPreferences: React.FC = () => {
  const history = useHistory();
  const { uid } = useAuth();
  const handleNext = () => {
    history.push("/create_acct_pref_pg2");
  };

   const [ taskData, setTaskData ] = useState<Course>({
      course_name: null,
      academic_term: null,
      notes: null,
      user_id: uid,
    });

    const handleInputChange = (e: IonInputCustomEvent<InputChangeEventDetail>, field: keyof Course) => {
      console.log("Field [", field, "] set to [", e.target.value, "]");
      setTaskData({ ...taskData, [field]: e.target.value, });
    };

    const handleCreate = async () => {
   
      // TODO: Add storing of task
      console.log("Storing task: ", taskData);
  
      try {
        const response = await fetch("http://localhost:5050/api/courseSelect/addCourseSelection", {
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

  // == Set-Up - Courses ==

  // [Quarter System / Semester System] - ion-segment
  // -- Courses --
  // [Course 1 - Days of Week - Time - Description] [Remove Course] - ion-input, ion-datetime
  // ...
  // [ Add Course ] - ion-button
  // [ Next ] - ion-button

  // * Date multi-select (i.e. M T W T F) - should implement, but haven't figured out how yet
  // * besides checkboxes which would look kind of lame tbh

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={handleNext}>Next</IonButton>
          </IonButtons>
          <IonTitle>Set-Up - Courses</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonItem>
          <IonSegment value="default">
            <IonSegmentButton value="default">
              <IonLabel>Quarter System</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="segment">
              <IonLabel>Semester System</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonItem>

        <IonItem><IonLabel>Courses</IonLabel></IonItem>
        <IonItem>
          <IonInput aria-label="Course Name" placeholder="Course Name"></IonInput>
          <IonInput aria-label="Description" placeholder="Description"></IonInput>
          <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
          <IonModal keepContentsMounted={true}>
            <IonDatetime presentation="time" id="datetime"></IonDatetime>
          </IonModal>
          <IonButton>Remove</IonButton> {/* Doesn't do anything yet */}
        </IonItem>
        <IonItem>
          <IonButton>Add Course</IonButton> {/* Doesn't do anything yet */}
        </IonItem>

      </IonContent>
      {/* <IonContent className="ion-flex ion-justify-content-center ion-align-items-center ion-padding">
        <IonButton expand="full" onClick={handleBack}>Done</IonButton>
      </IonContent> */}
    </IonPage>
  );
};

export default CreateAccountPreferences;