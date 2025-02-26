import { Request, Response } from "express";
import { db } from "../config/firebase";

export const getTask = async (req: Request, res: Response) => {
  const { taskid } = req.params; // Get task ID from request params
  console.log("GET request sent to getTask: taskId: ", taskid)
  // return res.status(200)
  try {
    const taskDoc = await db.collection("tasks").doc(taskid).get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      message: "Task retrieved successfully!",
      task: { id: taskDoc.id, ...taskDoc.data() }, // Return task data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const closeTask = async (req: Request, res: Response) => {
  const { taskid } = req.params; // Extract task ID from the URL parameters

  try {
    // Query Firestore to get the task document by ID
    const taskRef = await db.collection("tasks").doc(taskid).get();

    if (!taskRef.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update the 'completed' field to true
    await db.collection("tasks").doc(taskid).update({
      completed: true,
    });

    // Return success response
    res.status(200).json({
      message: "Task marked as completed successfully!",
      taskId: taskid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const openTask = async (req: Request, res: Response) => {
  const { taskid } = req.params; // Extract task ID from the URL parameters

  try {
    // Query Firestore to get the task document by ID
    const taskRef = await db.collection("tasks").doc(taskid).get();

    if (!taskRef.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update the 'completed' field to false
    await db.collection("tasks").doc(taskid).update({
      completed: false,
    });

    // Return success response
    res.status(200).json({
      message: "Task unmarked as completed successfully!",
      taskId: taskid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateTimeSpent = async (req: Request, res: Response) => {
  const { taskid } = req.params; // Extract task ID from the URL parameters
  const { additionalTime } = req.body; // Get additional time from request body

  try {
    // Query Firestore to get the task document by ID
    const taskRef = await db.collection("tasks").doc(taskid).get();

    if (!taskRef.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    const currentData = taskRef.data();
    const currentTimeSpent = currentData?.time_spent || 0; // Default to 0 if missing
    // Calculate the new total time spent
    const newTimeSpent = currentTimeSpent + additionalTime;

    // Update the 'time_spent' field 
    await db.collection("tasks").doc(taskid).update({
      time_spent: newTimeSpent
    });

    // Return success response
    res.status(200).json({ message: "Time spent updated successfully!", taskId: taskid, newTimeSpent });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};
