import mongoose from 'mongoose';

const gstConfigSchema = new mongoose.Schema({
  configId: {
    type: String,
    default: 'global_gst_config',
    unique: true,
    required: true
  },
  gstEnabled: {
    type: Boolean,
    default: true
  },
  defaultRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 18
  },
  isInclusive: {
    type: Boolean,
    default: false // false: Base + 18% GST = Total; true: Price already includes 18% GST
  },
  hsnSacCode: {
    type: String,
    default: '998211', // Legal advisory and representation services
    trim: true
  },
  taxName: {
    type: String,
    default: 'GST',
    trim: true
  },
  description: {
    type: String,
    default: 'Goods and Services Tax (GST) applicable on legal consultancy under SAC 998211',
    trim: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'System Admin'
  }
});

gstConfigSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (typeof next === 'function') next();
});

export const GstConfig = mongoose.models.GstConfig || mongoose.model('GstConfig', gstConfigSchema);
