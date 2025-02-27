import express from "express";
import { getAllTasks, closeTask } from "../controllers/taskListController";

const router = express.Router();

router.get("/getAllTasks/:uid", getAllTasks);
router.patch("/closeTask/:taskid", closeTask);

export default router;