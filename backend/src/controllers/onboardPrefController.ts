import { Request, Response } from "express";
import { db } from "../config/firebase";

export const addInitialPrefs = async (req: Request, res: Response) => {
  const {
    mostProductiveTime,
    flexibility,
    workDuration,
    breakDuration,
    selectedBreaks,
    user_id
  } = req.body;

  if (!user_id || !workDuration || !breakDuration || !selectedBreaks ||
      mostProductiveTime === null || flexibility === null // think this is needed bc these can be 0
  ) {
    return res.status(400).json({ error: "A required field is missing." });
  }

  const preferences = {
    user_id: user_id,
    most_productive_time: mostProductiveTime,
    flexibility: flexibility,
    work_duration: workDuration,
    break_duration: breakDuration,
    selected_breaks: selectedBreaks,
  };

  try {
    const prefRef = await db.collection("preferences").doc(user_id).set(preferences, { merge: true });
    res.status(201).json({ message: "Preferences saved successfully!", 
    // preferencesId: prefRef.id, // copied from prefSettingsController, but it's null; I don't think it's needed anyway though
    preferences: preferences});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};
