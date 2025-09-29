import express from 'express';
import { createService, getAllServices } from '../controllers/serviceController.js';
const router = express.Router();

// Route to submit the form
router.post('/submit', createService);

// Optional: get all submissions for admin
router.get('/', getAllServices);

export default router;
