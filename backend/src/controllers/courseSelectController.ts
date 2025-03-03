import { Request, Response } from "express";
import { db } from "../config/firebase";

export const addCourseSelection = async (req: Request, res: Response) => {
  const {
    course_name,
    academic_term,
    notes,
    user_id,
  } = req.body;

//   if (!user_id || !name || !breakDuration || !selectedBreaks ||
//       mostProductiveTime === null || flexibility === null // think this is needed bc these can be 0
//   ) {
//     return res.status(400).json({ error: "A required field is missing." });
//   }

  const preferences = {
    course_name: course_name,
    academic_term: academic_term,
    notes: notes,
    user_id: user_id,
  };

  try {
    const prefRef = await db.collection("course").doc(user_id).set(preferences, { merge: true });
    res.status(201).json({ message: "Preferences saved successfully!", 
    preferences: preferences});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};