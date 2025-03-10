import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonToolbar,
  IonLabel
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Course } from "../interfaces/CourseInterface";
import React, { useState, useEffect } from "react";
import { InputChangeEventDetail, IonInputCustomEvent } from "@ionic/core";
import './CreateAccountPreferences.css';

const CreateAccountPreferences: React.FC = () => {
  const history = useHistory();
  const { uid } = useAuth();

  const initialCourseState: Course = {
    course_name: "NULL",
    user_id: uid,
    avg_time_homework: "3",
    avg_time_project: "8",
    avg_time_quiz: "2",
    avg_time_reading: "2",
    avg_time_test: "2",
    course_index: 0,
  };

  const [courses, setCourses] = useState<Course[]>(Array.from({ length: 4 }, (_, index) => ({
    ...initialCourseState,
    course_index: index,
  })));

  const [clearedCourses, setClearedCourses] = useState<boolean[]>(Array(4).fill(false));

  const handleInputChange = (
    e: IonInputCustomEvent<InputChangeEventDetail>,
    index: number,
    field: keyof Course
  ) => {
    console.log(`Field [${field}] in Course [${index}] set to [${e.target.value}]`);
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses[index] = { ...updatedCourses[index], [field]: e.target.value };
      return updatedCourses;
    });
    setClearedCourses((prev) => {
      const updatedCleared = [...prev];
      updatedCleared[index] = false; // Reset the cleared message if input is updated
      return updatedCleared;
    });
  };

  const handleRemoveCourse = (index: number) => {
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses[index] = { ...initialCourseState, course_index: index };
      return updatedCourses;
    });

    setClearedCourses((prev) => {
      const updatedCleared = [...prev];
      updatedCleared[index] = true; // Show message after clearing the course
      return updatedCleared;
    });
  };

  useEffect(() => {
    console.log("Current Courses:", courses);
  }, [courses]);

  const handleAddTasks = async () => {
    try {
      const responses = await Promise.all(
        courses.map((course) =>
          fetch("http://localhost:5050/api/courseSelect/addCourseSelection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...course, user_id: uid }),
          })
        )
      );

      const results = await Promise.all(responses.map(res => res.json()));

      results.forEach((data, index) => {
        if (!responses[index].ok) {
          console.error(`Error saving course ${index + 1}:`, data.error);
        } else {
          console.log(`Course ${index + 1} saved successfully:`, data);
        }
      });

    } catch (error) {
      console.error("Error saving courses:", error);
    }
  };

  const handleNext = async () => {
    await handleAddTasks(); // Save before navigating
    history.push("/create_acct_pref_pg2");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={handleNext}>Next</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {courses.map((course, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <h2 className="course-title">Course {index + 1}</h2>
            <IonItem>
              <IonInput
                label="Course Name"
                labelPlacement="floating"
                value={course.course_name !== "NULL" ? course.course_name : ""}
                onIonInput={(e) => handleInputChange(e, index, "course_name")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Average Homework Time (hours)"
                labelPlacement="floating"
                value={course.course_name !== "NULL" ? course.avg_time_homework : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_homework")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Average Project Time (hours)"
                labelPlacement="floating"
                value={course.course_name !== "NULL" ? course.avg_time_project : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_project")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Average Quiz Time (hours)"
                labelPlacement="floating"
                value={course.course_name !== "NULL" ? course.avg_time_quiz : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_quiz")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Average Reading Time (hours)"
                labelPlacement="floating"
                value={course.course_name !== "NULL" ? course.avg_time_reading : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_reading")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Average Test Time (hours)"
                labelPlacement="floating"
                value={course.course_name !== "NULL" ? course.avg_time_test : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_test")}
              />
            </IonItem>

            <IonItem>
              <IonButton color="danger" onClick={() => handleRemoveCourse(index)}>
                Remove Course {index + 1}
              </IonButton>
            </IonItem>
            {clearedCourses[index] && (
              <IonLabel color="danger" style={{ marginLeft: "1rem" }}>
                This course information is cleared, you may enter again
              </IonLabel>
            )}
          </div>
        ))}

        <div style={{ padding: "16px", textAlign: "center" }}>
          <IonButton expand="block" onClick={handleAddTasks}>
            Add All Courses
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateAccountPreferences;
