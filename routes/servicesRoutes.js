const express = require("express");
const router = express.Router();
const { createService, getAllServices, deleteService } = require("../controllers/serviceController");

// Submit form
router.post("/submit", createService);

// Get all submissions
router.get("/", getAllServices);
router.delete("/:id", deleteService);

module.exports = router;
