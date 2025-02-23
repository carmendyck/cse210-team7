import express from "express";
import { getTask } from "../controllers/viewTaskController";

const router = express.Router();

router.get("/getTask/:taskid", getTask);

export default router;