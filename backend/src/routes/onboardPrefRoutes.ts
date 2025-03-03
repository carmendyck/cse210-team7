import express from "express";
import { addInitialPrefs } from "../controllers/onboardPrefController";

const router = express.Router();

router.post("/addInitialPrefs", addInitialPrefs);

export default router;