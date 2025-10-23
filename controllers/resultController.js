const Result = require("../models/Result");

// Create a new result
exports.createResult = async (req, res) => {
  try {
    let { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ msg: "Student email is required" });
    }

    // Normalize email
    studentEmail = studentEmail.trim().toLowerCase();
    req.body.studentEmail = studentEmail;

    const result = new Result(req.body);
    await result.save();

    res.status(201).json({ msg: "Result added successfully", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Get all results (Admin)
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Get results by student email
exports.getResultsByEmail = async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();

    // Fetch results for this student
    const results = await Result.find({ studentEmail: email }).sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "No results found" });
    }

    // Take the latest result
    const latestResult = results[0];

    // Calculate score & totalMarks if not provided
    const score =
      latestResult.obtainedMarks ||
      latestResult.subjects.reduce((acc, sub) => acc + sub.total, 0);

    const totalMarks =
      latestResult.totalMarks ||
      latestResult.subjects.reduce((acc, sub) => acc + sub.total, 0);

    const percentage = ((score / totalMarks) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      result: {
        ...latestResult._doc,
        score,
        totalMarks,
        percentage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// Update a result by ID
exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!result) return res.status(404).json({ msg: "Result not found" });

    res.status(200).json({ msg: "Result updated successfully", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Delete a result by ID
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ msg: "Result not found" });
    res.status(200).json({ msg: "Result deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
