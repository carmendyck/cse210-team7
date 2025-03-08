import express from "express";
import { addCourseSelection } from "../controllers/courseSelectController";

const router = express.Router();

router.post("/addCourseSelection", addCourseSelection);

export default router;
