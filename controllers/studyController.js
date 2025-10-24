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


    const newMaterial = await StudyMaterial.create({
      className,
      subject,
      materialName,
      pdfFile: req.file.cloudinaryUrl,
      expiresAt: expiryDate,
    });

    await newMaterial.save()

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

    // Check if ID is valid
    if (!id) {
      return res.status(400).json({ message: "Invalid material ID" });
    }

    // Attempt to delete the material
    const material = await StudyMaterial.findByIdAndDelete(id);
    // Check if material was found and deleted
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }



    // If there is a PDF file associated, delete from Cloudinary
    if (material.pdfFile) {
      const urlParts = material.pdfFile.split("/");
      const fileWithExt = urlParts[urlParts.length - 1];
      const publicId = urlParts
        .slice(urlParts.indexOf("study-materials"))
        .join("/")
        .replace(".pdf", ""); // remove extension

      //  Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      console.log(`🗑 Deleted from Cloudinary: ${publicId}`);
    }



    // Respond with success message
    res.json({ message: "Material deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
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
