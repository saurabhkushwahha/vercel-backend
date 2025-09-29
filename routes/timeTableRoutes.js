const express = require("express");
const {
  createNotification,
  getAllNotifications,
  getNotificationsByClass,
  deleteNotification,
} = require("../controllers/timeTableController");

const router = express.Router();

// ✅ Routes
router.post("/", createNotification);               // Create notification
router.get("/", getAllNotifications);               // Get all notifications
router.get("/class/:className", getNotificationsByClass); // Get notifications by class
router.delete("/:id", deleteNotification);          // Delete by ID

module.exports = router;
