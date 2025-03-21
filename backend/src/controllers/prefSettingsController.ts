import { Request, Response } from "express";
import { db } from "../config/firebase";

export const updateBreaks = async (req: Request, res: Response) => {
  const { breakDuration,
    workDuration,
    selectedBreaks,
    user_id}
    = req.body;

  if (!user_id || !workDuration || !breakDuration || !selectedBreaks) {
    return res.status(400).json({ error: "User ID, work duration, break duration, and selected breaks are required!" });
  }

  const preferences = {
    user_id: user_id,
    work_duration: workDuration,
    break_duration: breakDuration,
    selected_breaks: selectedBreaks,
  };

  try {
    const prefRef = await db.collection("preferences").doc(user_id).set(preferences, { merge: true });
    res.status(201).json({ message: "Preferences updated successfully!", 
    preferencesId: prefRef.id,
    preferences: preferences});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBreaks = async (req: Request, res: Response) => {
    try {
      const userId = req.query.user_id
  
      if (!userId) {
        return res.status(400).json({ error: "Missing user_id" });
      }
  
      const prefDoc = await db.collection("preferences").doc(userId).get();
  
      if (!prefDoc.exists) {
        return res.status(404).json({ error: "Preferences not found" });
      }
  
      res.json(prefDoc.data());
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  };

