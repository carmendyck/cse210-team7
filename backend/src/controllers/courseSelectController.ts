import { Request, Response } from "express";
import { db } from "../config/firebase";

export const addCourseSelection = async (req: Request, res: Response) => {
  const {
    course_name,
    avg_time_homework,
    avg_time_project,
    avg_time_quiz,
    avg_time_reading,
    avg_time_test,
    user_id,
    course_index, 
  } = req.body;

  if (!user_id || !course_name.trim() || course_index === undefined) {
    return res.status(400).json({ error: "User ID, Course Name, and Course Index are required." });
  }

  const courseDocId = `${user_id}_${course_index}`; 
  const preferences = {
    course_name,
    avg_time_homework,
    avg_time_project,
    avg_time_quiz,
    avg_time_reading,
    avg_time_test,
  };

  try {
    await db.collection("course").doc(courseDocId).set(preferences, { merge: true });

    res.status(201).json({ 
      message: `Course ${course_index + 1} updated successfully!`,
      course_index,
      preferences
    });

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
