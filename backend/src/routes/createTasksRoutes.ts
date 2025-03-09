import express from "express";
import { addNewTask, updateTask } from "../controllers/createTasksController";

const router = express.Router();

router.post("/addnewtask", addNewTask);
router.patch("/updatetask/:taskid", updateTask);

export default router;