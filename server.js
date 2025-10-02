import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import studyMaterialRoutes from "./routes/studyRoute.js";
import serviceRoutes from "./routes/servicesRoutes.js";
import timeTableRoutes from "./routes/timeTableRoutes.js";
import StudyMaterial from "./models/study.js";

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  console.log("MongoDB connected successfully");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit app if DB connection fails
});

// Middleware
app.use(cors());
app.use(express.json());

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

// Only listen locally (for dev), but export for Vercel
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
