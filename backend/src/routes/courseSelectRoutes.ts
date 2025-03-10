import express from "express";
import { addCourseSelection, getCourse, getAllCourses } from "../controllers/courseSelectController";

const router = express.Router();

router.post("/addCourseSelection", addCourseSelection);
router.get("/getCourse/:courseid", getCourse);
router.get("/getAllCourses/:uid", getAllCourses);

export default router;
