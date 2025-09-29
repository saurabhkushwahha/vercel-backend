const Result = require("../models/Result");
const jwt = require("jsonwebtoken");

// ✅ Admin adds results
exports.addResults = async (req, res) => {
  try {
    const results = req.body.results;
    if (!results || results.length === 0)
      return res.status(400).json({ msg: "No results provided" });

    const savedResults = [];
    for (let r of results) {
      const percentage = ((r.score / r.totalMarks) * 100).toFixed(2);

      let existing = await Result.findOne({ studentEmail: r.studentEmail });
      if (existing) {
        existing.className = r.className;
        existing.score = r.score;
        existing.totalMarks = r.totalMarks;
        existing.percentage = percentage;
        existing.gpa = r.gpa; // optional update
        await existing.save();
        savedResults.push(existing);
      } else {
        const newResult = new Result({
          studentEmail: r.studentEmail,
          studentName: r.studentName,
          className: r.className,
          score: r.score,
          totalMarks: r.totalMarks,
          percentage: percentage,
          gpa: r.gpa, // optional
        });
        await newResult.save();
        savedResults.push(newResult);
      }
    }
    res.json({ msg: "Results added/updated", savedResults });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ✅ Admin login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin123" && password === "admin@123") {
    const token = jwt.sign({ username }, "adminSecret123", { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
};
 
// ✅ Get result by email
exports.getResultByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await Result.findOne({ studentEmail: email });

    if (!result) {
      return res.status(404).json({ msg: "No result found for this email" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
