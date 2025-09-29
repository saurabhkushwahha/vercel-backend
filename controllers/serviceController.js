import Service from '../models/services.js';

// POST - create new service submission
export const createService = async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: newService
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET - fetch all submissions (optional for admin)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
