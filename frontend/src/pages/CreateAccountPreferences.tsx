import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonToolbar
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
    course_name: "NULL", // The name is NULL means this course is not set
    user_id: uid,
    avg_time_homework: "3",
    avg_time_project: "8",
    avg_time_quiz: "2",
    avg_time_reading: "2",
    avg_time_test: "2",
    course_index: 0, // Initialize course_index as 0
  };

  // Initialize courses state with a dynamic array of 4 courses, each with an index
  const [courses, setCourses] = useState<Course[]>(Array.from({ length: 4 }, (_, index) => ({
    ...initialCourseState, 
    course_index: index, // Set the correct course_index
  })));

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
  };

  const handleRemoveCourse = (index: number) => {
    setCourses(prevCourses => {
      const updatedCourses = [...prevCourses];
      updatedCourses[index] = { ...initialCourseState, course_index: index }; // Preserve the index
      return updatedCourses;
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
            body: JSON.stringify({
              ...course,
              user_id: uid, // Ensure user_id is passed
            })
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
  
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/create_acct_pref_pg2")}>
              Next
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {courses.map((course, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <h2 className="course-title">Course {index + 1}</h2>
            <IonItem>
              <IonInput
                aria-label="Course Name"
                placeholder="Course Name"
                // value={course.course_name}
                value={course.course_name !== "NULL" ? course.course_name : ""}
                onIonInput={(e) => handleInputChange(e, index, "course_name")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                aria-label="Homework"
                placeholder="Average Homework Time (hours)"

                // value={course.avg_time_homework}
                value={course.course_name !== "NULL" ? course.avg_time_homework : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_homework")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                aria-label="Project"
                placeholder="Average Project Time (hours)"
                // value={course.avg_time_project}
                value={course.course_name !== "NULL" ? course.avg_time_project : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_project")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                aria-label="Quiz"
                placeholder="Average Quiz Time (hours)"
                // value={course.avg_time_quiz}
                value={course.course_name !== "NULL" ? course.avg_time_quiz : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_quiz")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                aria-label="Reading"
                placeholder="Average Reading Time (hours)"
                // value={course.avg_time_reading}
                value={course.course_name !== "NULL" ? course.avg_time_reading : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_reading")}
              />
            </IonItem>
            <IonItem>
              <IonInput
                aria-label="Test"
                placeholder="Average Test Time (hours)"
                // value={course.avg_time_test}
                value={course.course_name !== "NULL" ? course.avg_time_test : ""}
                onIonInput={(e) => handleInputChange(e, index, "avg_time_test")}
              />
            </IonItem>
            <IonItem>
              <IonButton 
                color="danger" 
                onClick={() => handleRemoveCourse(index)}
              >
                Remove Course {index + 1}
              </IonButton>
            </IonItem>
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
