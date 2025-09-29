import express from "express";
import { uploadMaterial, getMaterials, deleteMaterial } from "../controllers/studyController.js";
import { uploadToCloudinary, upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Routes
router.post("/upload", upload.single("pdfFile"), uploadToCloudinary, uploadMaterial);
router.get("/", getMaterials);
router.delete("/:id", deleteMaterial);

export default router;
