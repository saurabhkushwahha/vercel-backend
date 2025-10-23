const express = require("express");
const router = express.Router();
const { adminLogin, addResult } = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/auth");

// Admin login
router.post("/login", adminLogin);

// Admin add result
router.post("/results/add", adminAuth, addResult);

module.exports = router;
