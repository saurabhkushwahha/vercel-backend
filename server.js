import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";

// Import routes
import studyMaterialRoutes from "./routes/studyRoute.js";
import serviceRoutes from "./routes/servicesRoutes.js";
import timeTableRoutes from "./routes/timeTableRoutes.js";
import StudyMaterial from "./models/study.js";

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Static folder for uploaded files
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/student.js";
app.use("/api/admin", adminRoutes);     // Admin routes
app.use("/api/student", studentRoutes); // Student routes
app.use("/api/materials", studyMaterialRoutes);       // Study material routes
app.use("/api/services", serviceRoutes);              // Services routes
app.use("/api/notifications", timeTableRoutes);

// Test route
app.get("/", (_, res) => {
  res.send("API is running......");
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

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Export for Vercel serverless
export default app;