import { Request, Response } from "express";
import { db } from "../config/firebase";


export const addNewSchedule = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { schedule } = req.body;

  if (!schedule) {
    return res.status(400).json({ error: "Schedule is required!" });
  }
  if (!uid) {
    return res.status(400).json({ error: "User ID is required!" });
  }
  console.log("Received schedule", schedule, "for user", uid);

  const worktimesRef = db.collection('worktimes');
  const batchDelete = db.batch();
  const batchAdd = db.batch();

  try {
    // Retrieve and delete previous (incomplete) worktimes from tasks
    for (const worktime of schedule) {
      const task_id = worktime.task_id
      const taskRef = db.collection('tasks').doc(task_id);
      const worktimeSnapshot = await worktimesRef
        .where('task_id', '==', taskRef)
        .where('user_id', '==', uid)
        .where('completed', '==', false)
        .get();

      if (!worktimeSnapshot.empty) {
        worktimeSnapshot.forEach((docSnapshot: any) => {
          const worktime = docSnapshot.data();
          const worktimeId = docSnapshot.id;
          const worktimeRef = worktimesRef.doc(worktimeId);
          batchDelete.delete(worktimeRef);
        });
      }
    }

    await batchDelete.commit();
    console.log('Previous schedule deleted successfully!');

    // Add new schedule
    let worktimeRefs: string[] = [];
    for (const worktime of schedule) {
      const worktimeRef = worktimesRef.doc();
      const taskRef = db.collection('tasks').doc(worktime.task_id);
      batchAdd.set(worktimeRef, {
        user_id: uid,
        task_id: taskRef,
        task_name: worktime.task_name,
        task_due_date: worktime.task_due_date,
        date: worktime.date,
        hours: worktime.hours,
        completed: false,
      });
      worktimeRefs.push(worktimeRef.id);
    }

    await batchAdd.commit();
    console.log("New schedule added successfully!");

    res.status(201).json({
      message: 'Schedule updated successfully!',
      worktimeIds: worktimeRefs,
      schedule: schedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getWorktimes = async (req: Request, res: Response) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required"});
  }

  try {
    const worktimesRef = db.collection('worktimes');
    const worktimeSnapshot = await worktimesRef
    .where('user_id', '==', uid)
    .where('completed', '==', false)
    .get();

    if (worktimeSnapshot.empty) {
      return res.status(404).json({ error: "No worktimes found for this user" });
    }

    const worktimes = worktimeSnapshot.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      message: "Worktimes retrieved successfully!",
      worktimes: worktimes
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const markWorktimes = async (req: Request, res: Response) => {
  const { task_id } = req.params;
  console.log('Deleting future worktimes for task', task_id);

  if (!task_id) {
    return res.status(400).json({ error: "Task ID is required"});
  }

  try {
    // Get all worktimes associated with current task
    const worktimesRef = db.collection('worktimes');
    const taskRef = db.collection('tasks').doc(task_id);
    const worktimeSnapshot = await worktimesRef
    .where('task_id', '==', taskRef)
    .get();

    if (worktimeSnapshot.empty) {
      return res.status(404).json({ error: "No worktimes found associated with this task." });
    }

    // Mark future worktimes as complete (so user can see past recommended worktimes)
    const batchDelete = db.batch();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    worktimeSnapshot.forEach((docSnapshot: any) => {
      const worktime = docSnapshot.data();
      const worktimeRef = worktimesRef.doc(docSnapshot.id);
      const workDate = new Date(worktime.date);

      if (workDate > today) {
        batchDelete.delete(worktimeRef);
      }
    });

    await batchDelete.commit();
    console.log("Worktimes deleted successfully!");

    res.status(201).json({
      message: 'Worktimes updated successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};