const multer = require("multer")
const cloudinary = require("../utils/cloudinary.js")
const streamifier = require("streamifier")

//  Use memoryStorage to avoid writing files to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Middleware to upload file buffer directly to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload the buffer as a stream
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto", // PDFs are non-image files
            folder: "study-materials",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        // Stream the buffer to Cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    // Save the Cloudinary URL for controller use
    req.file.cloudinaryUrl = result.secure_url;

    next();
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(500).json({ error: "Cloud upload failed" });
  }
};

module.exports = { upload, uploadToCloudinary };
