const express = require("express");
const router = express.Router();
const { createService, getAllServices } = require("../controllers/serviceController");

// Submit form
router.post("/submit", createService);

// Get all submissions
router.get("/", getAllServices);

module.exports = router;
