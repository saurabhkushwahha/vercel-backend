import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  className: { type: String, required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true }, // auto calculate hoga controller me
  createdAt: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", ResultSchema);
export default Result;
