const express = require("express");
const router = express.Router();
const { getResultByEmail, addResults, adminLogin } = require("../controllers/adminController");

// ✅ Admin login
router.post("/login", adminLogin);

// ✅ Add Results
router.post("/results/add", addResults);

// ✅ Get result by email (frontend ke liye)
router.get("/results/:email", getResultByEmail);

module.exports = router;
