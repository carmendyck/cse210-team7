import express from "express";
import { updateNotifications, getNotifications } from "../controllers/notificationsController";

const router = express.Router();

router.post("/updateNotifications", updateNotifications);
router.get("/getNotifications", getNotifications);

export default router;