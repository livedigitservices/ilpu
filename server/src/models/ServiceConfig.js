import mongoose from 'mongoose';

const ServiceConfigSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  serviceTitle: {
    type: String,
    required: true,
    trim: true
  },
  whatsappGroupLink: {
    type: String,
    required: true,
    trim: true
  },
  whatsappChannelName: {
    type: String,
    default: '',
    trim: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const ServiceConfig = mongoose.models.ServiceConfig || mongoose.model('ServiceConfig', ServiceConfigSchema);
