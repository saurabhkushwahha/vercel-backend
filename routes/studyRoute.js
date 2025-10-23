const express = require("express");
const multer = require("multer");
const { uploadMaterial, getMaterials, deleteMaterial } = require("../controllers/studyController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/upload", upload.single("pdfFile"), uploadMaterial);
router.get("/", getMaterials);
router.delete("/:id", deleteMaterial);

module.exports = router;
