import express from "express";
import { updateBreaks } from "../controllers/prefSettingsController";

const router = express.Router();

router.post("/updateBreaks", updateBreaks);

export default router;