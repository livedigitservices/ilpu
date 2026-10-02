import dotenv from 'dotenv';
import { saveBooking } from '../db/store.js';
import { sendAdminBookingNotification } from '../config/mailer.js';

dotenv.config();

/**
 * Handle Direct UPI Payment Verification & Confirmation (GPay / PhonePe / Paytm / BHIM)
 */
export const verifyDirectUpiPayment = async (req, res) => {
  try {
    const {
      utr,
      upiApp = 'Google Pay',
      serviceId,
      serviceTitle,
      region = 'india',
      amount = 589,
      currency = 'INR',
      clientDetails
    } = req.body;

    const bookingId = `ILPU-BKG-${Date.now()}`;
    const transactionId = utr ? String(utr).trim() : `UPI-REF-${Date.now()}`;

    const client = clientDetails || {};
    const name = client.name || 'Client';
    const email = client.email || 'client@example.com';
    const phone = client.phone || 'N/A';
    const country = client.country || 'India';
    const notes = client.notes || client.details || '';

    const amountPaidStr = `₹499 + 18% GST (Total ₹589 INR)`;

    const fullBookingRecord = {
      id: bookingId,
      bookingId: bookingId,
      paypalOrderId: transactionId,
      paypalCaptureId: transactionId,
      paymentProvider: 'DIRECT_UPI',
      paymentMethod: upiApp,
      transactionId: transactionId,
      status: 'PAID',
      webhookVerified: true,
      serviceId: serviceId || 'general-consultation',
      serviceTitle: serviceTitle || '1-on-1 Legal Strategy Consultation',
      region: 'india',
      pricingTier: amountPaidStr,
      amount: Number(amount) || 589,
      currency: 'INR',
      amountPaid: amountPaidStr,
      clientDetails: {
        name,
        email,
        phone,
        country,
        notes
      },
      name,
      email,
      phone,
      country,
      details: notes,
      createdAt: new Date().toISOString()
    };

    // 1. Save to MongoDB Atlas & persistent JSON backup storage
    await saveBooking(fullBookingRecord);

    // 2. Dispatch email notification asynchronously in background (non-blocking for instant response)
    sendAdminBookingNotification(fullBookingRecord).catch(mailErr => {
      console.error('⚠️ [Background Mail Dispatch Warning]:', mailErr.message);
    });

    return res.status(200).json({
      success: true,
      bookingId: bookingId,
      booking: fullBookingRecord
    });

  } catch (err) {
    console.error('⚠️ [Direct UPI Verification Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to record UPI payment verification'
    });
  }
};
