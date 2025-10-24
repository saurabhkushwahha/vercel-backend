const express = require("express");
const { uploadMaterial, getMaterials, deleteMaterial } = require("../controllers/studyController");
const { upload, uploadToCloudinary } = require("../middlewares/uploadMiddleware")
const router = express.Router();

router.post("/upload", upload.single("pdfFile"), uploadToCloudinary, uploadMaterial);
router.get("/", getMaterials);
router.delete("/:id", deleteMaterial);

module.exports = router;
