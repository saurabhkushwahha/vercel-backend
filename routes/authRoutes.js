const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { checkAuth, signup, login, logout } = require("../controllers/authControllers");




router.get("/checkAuth", verifyToken, checkAuth)


router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
