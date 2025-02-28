import { Request, Response } from "express";
import { db } from "../config/firebase";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    // const user_id = req.params.uid; // Get user ID from request params
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ error: "User ID is required"});
    }
    
    const tasksRef = db.collection("tasks");
    const querySnapshot = await tasksRef.where("user_id", "==", uid).get();
    // just returns tasks for all users (for testing)
    // const querySnapshot = await db.collection("tasks").get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "No tasks found for this user" });
    }

    const tasks = querySnapshot.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      message: "Tasks retrieved successfully!",
      tasks: tasks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};


