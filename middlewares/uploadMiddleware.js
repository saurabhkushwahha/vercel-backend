import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// Create uploads dir if not exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// Middleware to upload file to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "study-materials",
    });

    req.file.cloudinaryUrl = result.secure_url;

    // Clean up local file after successful upload
    fs.unlinkSync(req.file.path);

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { upload, uploadToCloudinary };
