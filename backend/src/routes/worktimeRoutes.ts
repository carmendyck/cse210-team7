import express from "express";
import { addNewSchedule, getWorktimes, markWorktimes } from "../controllers/worktimeController";

const router = express.Router();

router.post("/addnewschedule/:uid", addNewSchedule);
router.get("/getworktimes/:uid", getWorktimes);
router.patch("/markworktimes/:task_id", markWorktimes);

export default router;