const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    previousSchool: { type: String },
    selectedClass: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
