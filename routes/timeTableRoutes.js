const express = require("express");
const {
  createNotification,
  getAllNotifications,
  getNotificationsByClass,
  deleteNotification,
} = require("../controllers/timeTableController");

const router = express.Router();

// Create Notification
router.post("/", createNotification);

// Get All Notifications
router.get("/", getAllNotifications);

// Get Notifications by Class
router.get("/class/:className", getNotificationsByClass);

// Delete Notification
router.delete("/:id", deleteNotification);

module.exports = router;
