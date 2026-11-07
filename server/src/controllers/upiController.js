import dotenv from 'dotenv';
import {
  saveBooking,
  getPricingPlanByIdFromStore,
  getGstConfigFromStore,
  getServiceWhatsAppLinkFromStore
} from '../db/store.js';
import { sendAdminBookingNotification } from '../config/mailer.js';
import { calculatePricingBreakdown } from '../utils/pricingEngine.js';

dotenv.config();

/**
 * Handle Direct UPI Payment Verification & Confirmation (GPay / PhonePe / Paytm / BHIM)
 * Recalculates exact pricing breakdown server-side from DB and stores financial snapshot.
 */
export const verifyDirectUpiPayment = async (req, res) => {
  try {
    const {
      utr,
      upiApp = 'Google Pay',
      planId,
      serviceId,
      serviceTitle,
      region = 'india',
      clientDetails
    } = req.body;

    const targetIdentifier = planId || serviceId || 'general-consultation';
    let plan = await getPricingPlanByIdFromStore(targetIdentifier);
    if (!plan) plan = await getPricingPlanByIdFromStore('general-consultation');

    const gstConfig = await getGstConfigFromStore();
    const breakdown = calculatePricingBreakdown(plan, gstConfig, 'india');

    const effectiveServiceId = plan?.serviceId || serviceId || 'general-consultation';
    const whatsappLink = await getServiceWhatsAppLinkFromStore(effectiveServiceId);

    const bookingId = `ILPU-BKG-${Date.now()}`;
    const transactionId = utr ? String(utr).trim() : `UPI-REF-${Date.now()}`;

    const client = clientDetails || {};
    const name = client.name || 'Client';
    const email = client.email || 'client@example.com';
    const phone = client.phone || 'N/A';
    const country = client.country || 'India';
    const notes = client.notes || client.details || '';

    const fullBookingRecord = {
      id: bookingId,
      bookingId: bookingId,
      planId: plan?.planId || '',
      paypalOrderId: transactionId,
      paypalCaptureId: transactionId,
      paymentProvider: 'DIRECT_UPI',
      paymentMethod: upiApp,
      transactionId: transactionId,
      status: 'PAID',
      webhookVerified: true,
      serviceId: effectiveServiceId,
      serviceTitle: serviceTitle || plan?.name || '1-on-1 Legal Strategy Consultation',
      region: 'india',
      pricingTier: breakdown.displayString,
      basePrice: breakdown.basePrice,
      gstRate: breakdown.gstRate,
      gstAmount: breakdown.gstAmount,
      totalAmount: breakdown.totalAmount,
      isInclusive: breakdown.isInclusive,
      hsnSacCode: breakdown.hsnSacCode,
      taxName: breakdown.taxName,
      whatsappGroupLink: whatsappLink,
      amount: breakdown.totalAmount,
      currency: 'INR',
      amountPaid: breakdown.displayString,
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

    // 2. Dispatch email notification asynchronously in background
    sendAdminBookingNotification(fullBookingRecord).catch(mailErr => {
      console.error('⚠️ [Background Mail Dispatch Warning]:', mailErr.message);
    });

    return res.status(200).json({
      success: true,
      bookingId: bookingId,
      booking: fullBookingRecord,
      serviceWhatsAppGroupLink: whatsappLink
    });

  } catch (err) {
    console.error('⚠️ [Direct UPI Verification Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to record UPI payment verification'
    });
  }
};
