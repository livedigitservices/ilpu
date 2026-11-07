import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  serviceId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  pricingType: {
    type: String,
    enum: ['one-time', 'recurring'],
    default: 'one-time'
  },
  billingInterval: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', null],
    default: null
  },
  // Pricing for India (INR)
  priceIndia: {
    type: Number,
    required: true,
    min: 0,
    default: 499
  },
  originalPriceIndia: {
    type: Number,
    min: 0,
    default: 1999
  },
  // Pricing for International (USD)
  priceInternational: {
    type: Number,
    required: true,
    min: 0,
    default: 5
  },
  originalPriceInternational: {
    type: Number,
    min: 0,
    default: 25
  },
  features: {
    type: [String],
    default: []
  },
  deliverables: {
    type: [String],
    default: []
  },
  badge: {
    type: String,
    default: 'Priority Advisory',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0,
    index: true
  },
  applicableGstRate: {
    type: Number,
    default: null // null means inherit global default GST rate
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pricingPlanSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (typeof next === 'function') next();
});

export const PricingPlan = mongoose.models.PricingPlan || mongoose.model('PricingPlan', pricingPlanSchema);
