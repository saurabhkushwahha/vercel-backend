const Student = require("../models/student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ✅ Student signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let student = await Student.findOne({ email });
    if (student)
      return res.status(400).json({ success: false, message: "Student already exists" });

    const hashed = await bcrypt.hash(password, 10);
    student = new Student({ name, email, password: hashed });
    await student.save();

    const token = jwt.sign({ id: student._id, email: student.email }, "studentSecret123", { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Signup successful",
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Student login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id, email: student.email }, "studentSecret123", { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
