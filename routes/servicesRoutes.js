const express = require('express');
const router = express.Router();
const { createService, getAllServices } = require('../controllers/serviceController');

// Route to submit the form
router.post('/submit', createService);

// Optional: get all submissions for admin
router.get('/', getAllServices);

module.exports = router;
