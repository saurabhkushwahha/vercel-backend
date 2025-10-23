const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      enum: [
        "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
        "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
        "Class 11", "Class 12",
      ],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    testDate: {
      type: Date,
      required: true,
    },
    testTime: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },

    // Auto-delete using TTL (1 day after testDate)
    expireAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
