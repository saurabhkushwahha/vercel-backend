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


// Delete the services

exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service is not Found !" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });

  } catch (error) {
    console.error("Error Deleting services : ", error);
    res.status(500).json({ success: false, message: "Failed to Delete services" })
  }
}