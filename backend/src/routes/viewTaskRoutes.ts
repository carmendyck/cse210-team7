import express from "express";
import { getTask, closeTask, openTask, updateTimeSpent } from "../controllers/viewTaskController";

const router = express.Router();

router.get("/getTask/:taskid", getTask);
router.patch("/closeTask/:taskid", closeTask);
router.patch("/openTask/:taskid", openTask);
router.patch("/updateTimeSpent/:taskid", updateTimeSpent);

export default router;