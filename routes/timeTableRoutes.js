import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotificationsByClass,
  deleteNotification,
} from "../controllers/timeTableController.js";

const router = express.Router();

// Routes
router.post("/", createNotification);               // Create notification
router.get("/", getAllNotifications);               // Get all notifications
router.get("/class/:className", getNotificationsByClass); // Get notifications by class
router.delete("/:id", deleteNotification);          // Delete by ID

export default router;
