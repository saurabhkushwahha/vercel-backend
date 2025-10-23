const jwt = require("jsonwebtoken");

exports.adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "adminSecret123"); // 👈 secret ko .env me daalna best practice hai
    if (decoded.role !== "admin") return res.status(403).json({ msg: "Admin access only" });
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
