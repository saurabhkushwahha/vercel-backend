const express = require("express");
const { uploadMaterial, getMaterials, deleteMaterial } = require("../controllers/studyController");
const{ uploadToCloudinary,upload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Routes
router.post("/upload", upload.single("pdfFile"),uploadToCloudinary, uploadMaterial);
router.get("/", getMaterials);
router.delete("/:id", deleteMaterial);

module.exports = router;
