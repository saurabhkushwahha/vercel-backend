require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

// Import routes
const studyMaterialRoutes = require("./routes/studyRoute");
const serviceRoutes = require("./routes/servicesRoutes");
const timeTableRoutes = require("./routes/timeTableRoutes");
const StudyMaterial = require("./models/study");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", require("./routes/admin"));     // Admin routes
app.use("/api/student", require("./routes/student")); // Student routes
app.use("/api/materials", studyMaterialRoutes);       // Study material routes
app.use("/api/services", serviceRoutes);              // Services routes
app.use("/api/notifications", timeTableRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ✅ Background Cleanup Job (every 1 min check expired files)
setInterval(async () => {
  try {
    const now = new Date();
    const expiredMaterials = await StudyMaterial.find({
      expiresAt: { $ne: null, $lt: now }, // sirf unko delete karo jinke expiry hai
    });

    for (let material of expiredMaterials) {
      const filePath = path.join(__dirname, "uploads", material.pdfFile);

      fs.unlink(filePath, (err) => {
        if (err) console.error("Auto delete file error:", err);
      });

      
    }
  } catch (error) {
    console.error("Cleanup job error:", error);
  }
}, 60 * 1000); // runs every 60 seconds

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
