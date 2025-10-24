require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Controllers
const { cleanupExpiredMaterials } = require("./controllers/studyController");

// Routes
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/admin");
const resultRoutes = require("./routes/resultRoutes");
const studyRoutes = require("./routes/studyRoute");
const serviceRoutes = require("./routes/servicesRoutes");
const timeTableRoutes = require("./routes/timeTableRoutes");
const notificationRoutes = require("./routes/timeTableRoutes"); // ✅ added

const app = express();
const PORT = process.env.PORT || 8080;

// -----------------
// Middleware
// -----------------
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// -----------------
// Connect MongoDB
// -----------------
connectDB(); // uses config/db.js

// -----------------
// API Routes
// -----------------
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/timetable", timeTableRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ notifications route

// -----------------
// Cleanup expired study materials
// -----------------
// setInterval(cleanupExpiredMaterials, 60 * 60 * 1000);
// setTimeout(cleanupExpiredMaterials, 5000);

// -----------------
// Root
// -----------------
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// -----------------
// Start Server
// -----------------
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
