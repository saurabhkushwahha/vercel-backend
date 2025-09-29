import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  selectedClass: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  previousSchool: {
    type: String
  },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
