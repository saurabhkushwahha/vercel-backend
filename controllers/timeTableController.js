const Notification = require("../models/timetable");

// Create Notification
const createNotification = async (req, res) => {
  try {
    const { className, subject, testDate, testTime, description } = req.body;


    if (!className || !subject || !testDate || !testTime) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Auto set expireAt (1 day after testDate)
    const expireAt = new Date(testDate);
    expireAt.setDate(expireAt.getDate() + 1);

    const newNotification = new Notification({
      className,
      subject,
      testDate,
      testTime,
      description,
      expireAt,
    });

    await newNotification.save();
    res
      .status(201)
      .json({ message: "Notification created successfully", newNotification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
};

// Get All Notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ testDate: 1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// Get Notifications by Class
const getNotificationsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const notifications = await Notification.find({ className }).sort({ testDate: 1 });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found for this class" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications by class:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// Delete Notification by ID
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationsByClass,
  deleteNotification,
};
