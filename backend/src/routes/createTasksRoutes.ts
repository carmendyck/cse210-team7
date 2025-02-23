import express from "express";
import { addNewTask } from "../controllers/createTasksController";

const router = express.Router();

router.post("/addnewtask", addNewTask);

export default router;