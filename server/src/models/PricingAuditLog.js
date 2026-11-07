import mongoose from 'mongoose';

const pricingAuditLogSchema = new mongoose.Schema({
  auditId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  changeType: {
    type: String,
    enum: ['PLAN_CREATED', 'PLAN_UPDATED', 'PLAN_DELETED', 'PLAN_STATUS_CHANGED', 'PLANS_REORDERED', 'GST_UPDATED'],
    required: true
  },
  entityId: {
    type: String,
    required: true
  },
  entityName: {
    type: String,
    default: ''
  },
  previousValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  changedBy: {
    type: String,
    default: 'Admin'
  },
  changeSummary: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export const PricingAuditLog = mongoose.models.PricingAuditLog || mongoose.model('PricingAuditLog', pricingAuditLogSchema);
