import express from "express";
import { addNewSchedule, getWorktimes } from "../controllers/worktimeController";

const router = express.Router();

router.post("/addnewschedule/:uid", addNewSchedule);
router.get("/getworktimes/:uid", getWorktimes);

export default router;