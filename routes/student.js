import express from "express";
import { signup, login, getMyResult } from "../controllers/studentController.js";
import { studentAuth } from "../middlewares/auth.js";
const router = express.Router();

// Student signup/login
router.post("/signup", signup);
router.post("/login", login);

// Get own result
router.get("/my-result", studentAuth, getMyResult);

export default router;
