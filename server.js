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
  res.send("API is running...");
});

setInterval(async () => {
  try {
    const now = new Date();
    const expiredMaterials = await StudyMaterial.find({
      expiresAt: { $ne: null, $lt: now }, 
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
}, 60 * 1000); 

const PORT = process.env.PORT || 8080;

// Only listen locally (for dev), but export for Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless
module.exports = app;