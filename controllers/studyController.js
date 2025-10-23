const { Readable } = require("stream");
const StudyMaterial = require("../models/study");
const cloudinary = require("../utils/cloudinary");

// Upload Material
exports.uploadMaterial = async (req, res) => {
  try {
    const { className, subject, materialName, expiresAt } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "File is required!" });

    let expiryDate = null;
    if (expiresAt && expiresAt !== "null") {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime()))
        return res.status(400).json({ message: "Invalid expiry date!" });
    }

    // Upload PDF to Cloudinary as RAW
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "study_materials",
          resource_type: "raw", // Important for PDFs
          public_id: `${Date.now()}_${materialName.replace(/\s+/g, "_")}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(req.file.buffer).pipe(stream);
    });

    const newMaterial = await StudyMaterial.create({
      className,
      subject,
      materialName,
      pdfFile: uploadResult.secure_url, // direct Cloudinary URL
      cloudinaryPublicId: uploadResult.public_id,
      expiresAt: expiryDate,
    });

    res.status(201).json({
      message: expiryDate
        ? `Material uploaded successfully. It will auto-delete at ${expiryDate.toLocaleString()}.`
        : "Material uploaded successfully. (Permanent file)",
      material: newMaterial,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all materials
exports.getMaterials = async (req, res) => {
  try {
    const now = new Date();
    const materials = await StudyMaterial.find({
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    }).sort({ uploadedAt: -1 });

    res.json(materials);
  } catch (error) {
    console.error("Get Materials Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await StudyMaterial.findById(id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    await cloudinary.uploader.destroy(material.cloudinaryPublicId, { resource_type: "raw" });
    await StudyMaterial.findByIdAndDelete(id);

    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Delete Material Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cleanup expired materials
exports.cleanupExpiredMaterials = async () => {
  try {
    const now = new Date();
    const expiredMaterials = await StudyMaterial.find({ expiresAt: { $ne: null, $lt: now } });

    for (let material of expiredMaterials) {
      await cloudinary.uploader.destroy(material.cloudinaryPublicId, { resource_type: "raw" });
      await StudyMaterial.findByIdAndDelete(material._id);
      console.log(`🗑 Deleted expired material: ${material.materialName}`);
    }
  } catch (error) {
    console.error("🛑 Cleanup job error:", error);
  }
};
