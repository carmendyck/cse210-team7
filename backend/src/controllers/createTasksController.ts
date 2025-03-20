import { Request, Response } from "express";
import { db } from "../config/firebase";

export const addNewTask = async (req: Request, res: Response) => {
  const { user_id, name, notes, location, due_datetime, priority, course_id, tags,
    time_spent, total_time_estimate, completed,
  } = req.body;

  if (!name || !due_datetime) {
    return res.status(400).json({ error: "Task name, course_id, and due_datetime are all required!" });
  }

  const newTask = {
    user_id: user_id,

    name: name,
    notes: notes,
    location: location,
    due_datetime: due_datetime,

    priority: priority,
    course_id: course_id,
    tags: tags,

    time_spent: time_spent,
    total_time_estimate: total_time_estimate, // TODO: convert to datetime later

    completed: completed,
  };

  try {
    const taskRef = await db.collection('tasks').add(newTask);

    res.status(201).json({
      message: 'Task added successfully!',
      taskId: taskRef.id,
      task: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};


export const updateTask = async (req: Request, res: Response) => {
  const { taskid } = req.params;
  const { name, notes, location, due_datetime, priority, course_id, tags, total_time_estimate } = req.body;

  try {
    const taskRef = await db.collection("tasks").doc(taskid).get();

    if (!taskRef.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update fields, TODO: only update changed fields
    await db.collection("tasks").doc(taskid).update({
      name: name,
      notes: notes,
      location: location,
      due_datetime: due_datetime,
      priority: priority,
      course_id: course_id,
      tags: tags,
      total_time_estimate: total_time_estimate,
    });

    // Return success response
    res.status(200).json({
      message: "Task updated successfully!",
      taskId: taskid,
      task: req.body
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};