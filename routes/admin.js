import express from "express";
import { getResultByEmail, addResults, adminLogin } from "../controllers/adminController.js";
const router = express.Router();

//  Admin login
router.post("/login", adminLogin);

//  Add Results
router.post("/results/add", addResults);

//  Get result by email (frontend ke liye)
router.get("/results/:email", getResultByEmail);

export default router;
