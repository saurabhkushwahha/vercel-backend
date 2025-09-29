const cloudinary = require ("../config/cloudinary")
const multer = require("multer")
const fs = require("fs");
const path=require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});



// Middleware to upload file to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "study-materials",
      });
    console.log(result)
    req.file.cloudinaryUrl = result.secure_url;
    // cleanup local file
    // fs.unlinkSync(req.file.path);

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports= { upload,uploadToCloudinary}