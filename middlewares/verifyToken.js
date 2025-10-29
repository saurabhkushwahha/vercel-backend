const jwt = require("jsonwebtoken")
require("dotenv").config();
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - token nahi hai provided" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - token Expired" })
        }
        req.userId = decoded.userId
        next()

    } catch (error) {

        console.log("Error is verifyToken : ", error)
        res.status(501).json({ success: false, message: "Server error" })

    }
}

module.exports = verifyToken