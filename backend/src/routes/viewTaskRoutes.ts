import express from "express";
import { getTask, closeTask, openTask } from "../controllers/viewTaskController";

const router = express.Router();

router.get("/getTask/:taskid", getTask);
router.patch("/closeTask/:taskid", closeTask);
router.patch("/openTask/:taskid", openTask);

export default router;