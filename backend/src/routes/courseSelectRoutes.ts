import express from "express";
import { addCourseSelection, getCourse } from "../controllers/courseSelectController";

const router = express.Router();

router.post("/addCourseSelection", addCourseSelection);
router.get("/getCourse/:courseid", getCourse);

export default router;
