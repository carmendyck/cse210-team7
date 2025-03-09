import { Request, Response } from "express";
import { db } from "../config/firebase";

export const updateNotifications = async (req: Request, res: Response) => {
  const { lockScreen, inApp, email, user_id } = req.body;

  if (user_id === undefined || lockScreen === undefined || inApp === undefined || email === undefined) {
    return res.status(400).json({ error: "User ID, lock screen, in-app, and email preferences are required!" });
  }

  const notifications = {
    lock_screen: lockScreen,
    in_app: inApp,
    email: email,
  };

  try {
    await db.collection("preferences").doc(user_id).set(notifications, { merge: true });
    res.status(201).json({ message: "Notification preferences updated successfully!", notifications});
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const prefDoc = await db.collection("preferences").doc(userId).get();

    if (!prefDoc.exists) {
      return res.status(404).json({ error: "Notification preferences not found" });
    }

    res.json(prefDoc.data());
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
