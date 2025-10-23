const Result = require("../models/Result");
const jwt = require("jsonwebtoken");

// Admin login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin123" && password === "admin@123") {
    const token = jwt.sign({ username, role: "admin" }, "adminSecret123", { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
};

// Add result
exports.addResult = async (req, res) => {
  try {
    const { studentEmail, className, score, totalMarks } = req.body;
    if (!studentEmail || !className || score == null || totalMarks == null) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const percentage = ((score / totalMarks) * 100).toFixed(2);

    // Check if result exists for this student email
    let existing = await Result.findOne({ studentEmail });
    if (existing) {
      existing.className = className;
      existing.score = score;
      existing.totalMarks = totalMarks;
      existing.percentage = percentage;
      await existing.save();
      return res.json({ msg: "Result updated", result: existing });
    }

    const newResult = new Result({ studentEmail, className, score, totalMarks, percentage });
    await newResult.save();

    res.status(201).json({ msg: "Result added", result: newResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
