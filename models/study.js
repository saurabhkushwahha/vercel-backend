const mongoose = require("mongoose");

const studySchema = new mongoose.Schema({
  className: { type: String, required: true },
  subject: { type: String, required: true },
  materialName: { type: String, required: true },
  pdfFile: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
});

module.exports = mongoose.model("StudyMaterial", studySchema);
