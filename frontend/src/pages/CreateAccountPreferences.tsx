import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSegment, IonSegmentButton,IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";

const CreateAccountPreferences: React.FC = () => {
  const history = useHistory();

  const handleNext = () => {
    history.push("/create_acct_pref_pg2");
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