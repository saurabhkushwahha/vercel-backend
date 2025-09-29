const StudyMaterial = require("../models/study");
const path = require("path");
const fs = require("fs");
const cloudinary= require("../config/cloudinary")

// ✅ Upload Material with custom expiry OR permanent
exports.uploadMaterial = async (req, res) => {
  try {
    const { className, subject, materialName, expiresAt } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required!" });
    }

    let expiryDate = null;

    // Agar user ne expiry diya hai to use karo
    if (expiresAt && expiresAt !== "null") {
      expiryDate = new Date(expiresAt); // frontend se ISO date string aayegi
      if (isNaN(expiryDate)) {
        return res.status(400).json({ message: "Invalid expiry date!" });
      }
    }

    const newMaterial = new StudyMaterial({
      className,
      subject,
      materialName,
      pdfFile: req.file.cloudinaryUrl,
      expiresAt: expiryDate,
    });


    await newMaterial.save();

    res.status(201).json({
      message: expiryDate
        ? `Material uploaded successfully. It will auto-delete at ${expiryDate.toLocaleString()}.`
        : "Material uploaded successfully. (Permanent file, will never auto-delete)",
      data: newMaterial,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Materials
exports.getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ uploadedAt: -1 });
    res.json(materials);
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Material (Manual Delete)
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await StudyMaterial.findByIdAndDelete(id);
     console.log("id saurabh",id)
     console.log(material)

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    
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


    const filePath = path.join(__dirname, "../uploads", material.pdfFile);

    fs.unlink(filePath, (err) => {
      if (err) console.error("File delete error:", err);
    });

    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
