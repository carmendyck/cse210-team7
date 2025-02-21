import { Request, Response } from "express";
import { db } from "../config/firebase";

export const addNewTask = async (req: Request, res: Response) => {
  const {
    user_id,
    name,
    notes,
    location,
    due_datetime,
    course_id,
    tags,
    next_start_time,
    next_end_time,
    time_spent,
    total_time_estimate,
    completed,
  } = req.body;

  if (!name || !course_id || !due_datetime) {
    return res.status(400).json({ error: "Task name, course_id, and due_datetime are all required!" });
  }

  const newTask = {
    user_id: user_id,

    name: name,
    notes: notes,
    location: location,
    due_datetime: due_datetime,

    course_id: course_id,
    tags: tags,

    time_spent: time_spent,
    total_time_estimate: total_time_estimate, // TODO: convert to datetime later

    completed: completed,
  };

  // if (!(next_start_time instanceof Date) || !(next_end_time instanceof Date)) {
  //   return res.status(400).json({ error: "Invalid next_start_time or next_end_time" });
  // }

  const nextWorktime = {
    start_time: next_start_time,
    end_time: next_end_time,
  }

  try {
    const taskRef = await db.collection('tasks').add(newTask);

    const nextWorktimesRef = taskRef.collection('next_worktimes');
    const nextTimeRef = await nextWorktimesRef.add(nextWorktime);

    res.status(201).json({
      message: 'Task added successfully!',
      taskId: taskRef.id,
      task: newTask,
      worktimeId: nextTimeRef.id,
      nextWorktime: nextWorktime,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};