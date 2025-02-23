import { Request, Response } from "express";
import { db } from "../config/firebase";

export const getTask = async (req: Request, res: Response) => {
  const { taskid } = req.params; // Get task ID from request params
  console.log("GET request sent to getTask: taskId: ", taskid)
  return res.status(200)

  // try {
  //   const taskDoc = await db.collection("tasks").doc(taskid).get();

  //   if (!taskDoc.exists) {
  //     return res.status(404).json({ error: "Task not found" });
  //   }

  //   res.status(200).json({
  //     message: "Task retrieved successfully!",
  //     task: { id: taskDoc.id, ...taskDoc.data() }, // Return task data
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: (error as Error).message });
  // }
};
