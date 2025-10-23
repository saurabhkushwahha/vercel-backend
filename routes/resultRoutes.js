const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

// Routes
router.post("/", resultController.createResult); // Add new result
router.get("/", resultController.getAllResults); // Get all results (Admin)
router.get("/student/:email", resultController.getResultsByEmail); // Get results by student email
router.put("/:id", resultController.updateResult); // Update result by ID
router.delete("/:id", resultController.deleteResult); // Delete result by ID

module.exports = router;
