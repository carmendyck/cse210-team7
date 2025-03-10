import { Request, Response } from "express";
import { db } from "../config/firebase";


export const addNewSchedule = async (req: Request, res: Response) => {
  const { user_id, schedule } = req.body;

  if (!schedule) {
    return res.status(400).json({ error: "Schedule is required!" });
  }
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required!" });
  }

  const worktimesRef = db.collection('worktimes');
  const batchDelete = db.batch();
  const batchAdd = db.batch();

  try {
    // Retrieve and delete previous (incomplete) worktimes from tasks
    for (const worktime of schedule) {
      const task_id = worktime.task_id
      const worktimeSnapshot = await worktimesRef
        .where('task_id', '==', task_id)
        .where('user_id', '==', user_id)
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
      batchAdd.set(worktimeRef, {
        user_id: user_id,
        task_id: "/tasks/" + worktime.task_id,
        task_name: worktime.task_name,
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
    const worktimeSnapshot = await worktimesRef.where('user_id', '==', uid).get();

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