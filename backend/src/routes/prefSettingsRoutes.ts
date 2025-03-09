import express from "express";
import { updateBreaks, getBreaks } from "../controllers/prefSettingsController";

const router = express.Router();

router.post("/updateBreaks", updateBreaks);
router.get("/getBreaks", getBreaks);

export default router;
