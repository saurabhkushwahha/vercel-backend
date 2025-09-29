import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subject: { type: String, required: true },
  materialName: { type: String, required: true },
  pdfFile: { type: String, required: true }, // filename stored
  uploadedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null }, // null = permanent
});

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);
export default StudyMaterial;
