const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  objective: { type: Number, required: true },
  subjective: { type: Number, required: true },
  total: { type: Number, required: true },
});

const ResultSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    parentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    className: { type: String, required: true },
    testId: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    subjects: [SubjectSchema], // Array of subjects
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", ResultSchema);
