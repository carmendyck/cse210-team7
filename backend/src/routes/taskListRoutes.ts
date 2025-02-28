import express from "express";
import { getAllTasks} from "../controllers/taskListController";

const router = express.Router();

router.get("/getAllTasks/:uid", getAllTasks);

export default router;