import express from "express";
import { uploadMaterial, getMaterials, deleteMaterial } from "../controllers/studyController.js";
import { uploadToCloudinary, upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Route for uploading a study material
router.post("/upload", upload.single("pdfFile"), uploadToCloudinary, uploadMaterial);

// Route for fetching all materials
router.get("/", getMaterials);

// Route for deleting a specific material
router.delete("/:id", deleteMaterial);

export default router;
