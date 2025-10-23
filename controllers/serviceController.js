const Service = require("../models/services");

// Create new service form submission
exports.createService = async (req, res) => {
  try {
    const newService = new Service(req.body);
    const saved = await newService.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("❌ Error saving service:", err);
    res.status(500).json({ success: false, message: "Failed to submit service" });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};
