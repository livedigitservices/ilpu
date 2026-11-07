import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    planId: {
      type: String,
      default: ''
    },
    paypalOrderId: {
      type: String
    },
    paypalCaptureId: {
      type: String
    },
    paymentProvider: {
      type: String,
      default: 'PAYPAL'
    },
    paymentMethod: {
      type: String,
      default: 'CARD'
    },
    transactionId: {
      type: String
    },
    webhookVerified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'PAID'
    },
    serviceId: {
      type: String,
      required: true
    },
    serviceTitle: {
      type: String,
      required: true
    },
    region: {
      type: String,
      enum: ['india', 'international'],
      default: 'india'
    },
    pricingTier: {
      type: String
    },
    // Exact financial breakdown
    basePrice: {
      type: Number
    },
    gstRate: {
      type: Number,
      default: 0
    },
    gstAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number
    },
    isInclusive: {
      type: Boolean,
      default: false
    },
    hsnSacCode: {
      type: String,
      default: '998211'
    },
    taxName: {
      type: String,
      default: 'GST'
    },
    whatsappGroupLink: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    amountPaid: {
      type: String
    },
    clientDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
      notes: { type: String, default: '' }
    },
    // Top-level aliases for quick indexing
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    country: { type: String },
    details: { type: String }
  },
  {
    timestamps: true
  }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
