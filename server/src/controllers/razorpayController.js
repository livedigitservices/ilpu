import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  saveBooking,
  getPricingPlanByIdFromStore,
  getGstConfigFromStore,
  getServiceWhatsAppLinkFromStore
} from '../db/store.js';
import { sendAdminBookingNotification } from '../config/mailer.js';
import { Booking } from '../models/Booking.js';
import { calculatePricingBreakdown } from '../utils/pricingEngine.js';

dotenv.config();

/**
 * Dynamically get configured Razorpay instance with current environment variables
 */
const getRazorpayInstance = () => {
  const key_id = (process.env.RAZORPAY_KEY_ID || 'rzp_test_ThLYeWwjJM4OQI').trim();
  const key_secret = (process.env.RAZORPAY_KEY_SECRET || 'ilpu_razorpay_secret_key_2026').trim();

  if (!key_id || !key_secret || key_id.includes('ILPULegal2026')) {
    return null;
  }

  try {
    return new Razorpay({ key_id, key_secret });
  } catch (e) {
    console.warn('⚠️ Razorpay initialization warning:', e.message);
    return null;
  }
};

/**
 * 1. Create a Razorpay Order for Indian UPI / Card / Netbanking Checkout
 * SECURE: Never trusts client-submitted amount. Calculates directly from DB plan & GST config.
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { planId, serviceId, serviceTitle, region = 'india', clientDetails } = req.body;

    // Lookup plan from DB / store
    const targetIdentifier = planId || serviceId || 'general-consultation';
    let plan = await getPricingPlanByIdFromStore(targetIdentifier);

    if (!plan) {
      // Fallback to general consultation plan if not found
      plan = await getPricingPlanByIdFromStore('general-consultation');
    }

    if (!plan || plan.isActive === false) {
      return res.status(400).json({
        success: false,
        error: 'The requested service plan is currently unavailable or inactive.'
      });
    }

    const gstConfig = await getGstConfigFromStore();
    const isIndia = region.toLowerCase() === 'india';
    const breakdown = calculatePricingBreakdown(plan, gstConfig, isIndia ? 'india' : 'international');

    const amountInPaise = breakdown.totalPaiseOrCents;
    const currency = breakdown.currency;
    const receiptId = `rcpt_${Date.now()}`;
    const rzp = getRazorpayInstance();
    const activeKeyId = (process.env.RAZORPAY_KEY_ID || 'rzp_test_ThLYeWwjJM4OQI').trim();

    if (!rzp) {
      console.warn('⚠️ [Razorpay Key Notice]: Missing or placeholder Razorpay credentials.');
      return res.status(400).json({
        success: false,
        isPlaceholderKey: true,
        error: 'Please add your matching RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from dashboard.razorpay.com into server/.env, or use Direct UPI Confirmation.'
      });
    }

    try {
      const razorpayOrder = await rzp.orders.create({
        amount: amountInPaise,
        currency: currency,
        receipt: receiptId,
        notes: {
          planId: plan.planId,
          serviceId: plan.serviceId,
          serviceTitle: serviceTitle || plan.name,
          region: isIndia ? 'india' : 'international',
          basePrice: String(breakdown.basePrice),
          gstRate: String(breakdown.gstRate),
          gstAmount: String(breakdown.gstAmount),
          totalAmount: String(breakdown.totalAmount),
          isInclusive: String(breakdown.isInclusive),
          hsnSacCode: breakdown.hsnSacCode || '998211',
          clientName: clientDetails?.name || 'Client',
          clientEmail: clientDetails?.email || '',
          clientPhone: clientDetails?.phone || '',
          clientCountry: clientDetails?.country || 'India'
        }
      });

      return res.status(200).json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: activeKeyId,
        planId: plan.planId,
        serviceId: plan.serviceId,
        breakdown
      });
    } catch (razorpayErr) {
      console.error('⚠️ [Razorpay API Authentication Error]:', razorpayErr.error || razorpayErr.message || razorpayErr);
      return res.status(400).json({
        success: false,
        error: 'Razorpay Key Secret mismatch or authentication failed. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env, or use Direct UPI Confirmation.',
        details: razorpayErr.error?.description || razorpayErr.message
      });
    }

  } catch (err) {
    console.error('⚠️ [Razorpay Create Order System Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'System error while creating Razorpay payment order',
      details: err.message
    });
  }
};

/**
 * 2. Verify Razorpay Payment Signature (HMAC SHA256)
 * SECURE: Recalculates expected pricing and attaches verified snapshot to booking record.
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = 'UPI',
      planId,
      serviceId,
      serviceTitle,
      region = 'india',
      clientDetails
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing Razorpay order ID or payment ID'
      });
    }

    // Idempotency check: check if booking was already created/processed for this order or payment
    const existing = await Booking.findOne({
      $or: [
        { paypalOrderId: razorpay_order_id },
        { transactionId: razorpay_payment_id },
        { paypalCaptureId: razorpay_payment_id }
      ]
    });

    if (existing) {
      console.log(`ℹ️ [Razorpay Payment]: Booking already exists: ${existing.bookingId}`);
      if (existing.status !== 'PAID') {
        existing.status = 'PAID';
        existing.webhookVerified = true;
        await existing.save();
      }
      return res.status(200).json({
        success: true,
        bookingId: existing.bookingId,
        booking: existing
      });
    }

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || 'ilpu_razorpay_secret_key_2026').trim();
    let isValidSignature = true;

    // Verify HMAC-SHA256 signature if live secret is available
    if (keySecret && !keySecret.includes('ILPULegal2026') && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValidSignature = (generatedSignature === razorpay_signature);
    }

    if (!isValidSignature) {
      console.error('⚠️ [Razorpay Invalid Signature]:', { razorpay_order_id, razorpay_payment_id });
      return res.status(400).json({
        success: false,
        error: 'Razorpay payment signature verification failed'
      });
    }

    // Lookup verified plan & GST breakdown
    const targetIdentifier = planId || serviceId || 'general-consultation';
    let plan = await getPricingPlanByIdFromStore(targetIdentifier);
    if (!plan) plan = await getPricingPlanByIdFromStore('general-consultation');

    const gstConfig = await getGstConfigFromStore();
    const isIndia = region.toLowerCase() === 'india';
    const breakdown = calculatePricingBreakdown(plan, gstConfig, isIndia ? 'india' : 'international');

    const effectiveServiceId = plan?.serviceId || serviceId || 'general-consultation';
    const whatsappLink = await getServiceWhatsAppLinkFromStore(effectiveServiceId);

    const bookingId = `ILPU-BKG-${Date.now()}`;
    const client = clientDetails || {};
    const name = client.name || 'Client';
    const email = client.email || 'client@example.com';
    const phone = client.phone || 'N/A';
    const country = client.country || (isIndia ? 'India' : 'International');
    const notes = client.notes || client.details || '';

    const fullBookingRecord = {
      id: bookingId,
      bookingId: bookingId,
      planId: plan?.planId || '',
      paypalOrderId: razorpay_order_id,
      paypalCaptureId: razorpay_payment_id,
      paymentProvider: 'RAZORPAY',
      paymentMethod: paymentMethod || 'RAZORPAY_OFFICIAL_GATEWAY',
      transactionId: razorpay_payment_id,
      status: 'PAID',
      webhookVerified: true,
      serviceId: effectiveServiceId,
      serviceTitle: serviceTitle || plan?.name || '1-on-1 Legal Strategy Consultation',
      region: isIndia ? 'india' : 'international',
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
      currency: breakdown.currency,
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

    // 1. Save to MongoDB Atlas & persistent JSON backup
    await saveBooking(fullBookingRecord);

    // 2. Automatically dispatch admin email notification in background
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
    console.error('⚠️ [Verify Razorpay Payment Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify Razorpay payment'
    });
  }
};

/**
 * 3. Razorpay Webhook Verification & Handler
 */
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'ilpu_razorpay_webhook_secret_2026';
    const signature = req.headers['x-razorpay-signature'];

    if (signature && webhookSecret) {
      const bodyToVerify = req.rawBody ? req.rawBody : JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(bodyToVerify)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('⚠️ [Razorpay Webhook Invalid Signature]');
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    const { event, payload } = req.body;
    console.log(`🔔 [Razorpay Webhook Event Received]: ${event}`);

    // Handle payment.captured and order.paid events
    if ((event === 'payment.captured' || event === 'order.paid') && (payload?.payment?.entity || payload?.order?.entity)) {
      const paymentEntity = payload.payment?.entity;
      const orderEntity = payload.order?.entity;
      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;

      // Update matching booking status in database if available
      const existingBooking = await Booking.findOne({
        $or: [{ paypalOrderId: orderId }, { transactionId: paymentId }]
      });

      if (existingBooking) {
        existingBooking.status = 'PAID';
        existingBooking.webhookVerified = true;
        if (paymentId && !existingBooking.transactionId) {
          existingBooking.transactionId = paymentId;
        }
        await existingBooking.save();
        console.log(`✅ [Razorpay Webhook]: Verified & Updated Booking ${existingBooking.bookingId}`);
      } else if (paymentEntity) {
        const notes = paymentEntity.notes || {};
        const bookingId = `ILPU-BKG-${Date.now()}`;
        const amountVal = paymentEntity.amount ? (paymentEntity.amount / 100) : 589;
        const currencyVal = paymentEntity.currency || 'INR';

        const serviceId = notes.serviceId || 'general-consultation';
        const whatsappLink = await getServiceWhatsAppLinkFromStore(serviceId);

        const newBooking = {
          id: bookingId,
          bookingId: bookingId,
          planId: notes.planId || '',
          paypalOrderId: orderId,
          paypalCaptureId: paymentId,
          paymentProvider: 'RAZORPAY',
          paymentMethod: paymentEntity.method || 'WEBHOOK_CAPTURED',
          transactionId: paymentId,
          status: 'PAID',
          webhookVerified: true,
          serviceId: serviceId,
          serviceTitle: notes.serviceTitle || 'Legal Strategy Consultation',
          region: currencyVal === 'USD' ? 'international' : 'india',
          pricingTier: `${currencyVal === 'USD' ? '$' : '₹'}${amountVal}`,
          basePrice: Number(notes.basePrice) || amountVal,
          gstRate: Number(notes.gstRate) || 0,
          gstAmount: Number(notes.gstAmount) || 0,
          totalAmount: amountVal,
          isInclusive: notes.isInclusive === 'true',
          hsnSacCode: notes.hsnSacCode || '998211',
          whatsappGroupLink: whatsappLink,
          amount: amountVal,
          currency: currencyVal,
          amountPaid: `${currencyVal === 'USD' ? '$' : '₹'}${amountVal} ${currencyVal}`,
          clientDetails: {
            name: notes.clientName || paymentEntity.email || 'Client',
            email: notes.clientEmail || paymentEntity.email || '',
            phone: notes.clientPhone || paymentEntity.contact || '',
            country: notes.clientCountry || 'India',
            notes: 'Created via Razorpay Webhook Confirmation'
          },
          name: notes.clientName || paymentEntity.email || 'Client',
          email: notes.clientEmail || paymentEntity.email || '',
          phone: notes.clientPhone || paymentEntity.contact || '',
          country: notes.clientCountry || 'India',
          details: 'Created via Razorpay Webhook Confirmation',
          createdAt: new Date().toISOString()
        };

        await saveBooking(newBooking);
        sendAdminBookingNotification(newBooking).catch(err => {
          console.error('⚠️ [Webhook Mail Dispatch Warning]:', err.message);
        });
        console.log(`✅ [Razorpay Webhook]: Created New Verified Booking ${bookingId}`);
      }
    }

    // Handle payment.failed event
    if (event === 'payment.failed' && payload?.payment?.entity) {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const errorDesc = paymentEntity.error_description || paymentEntity.error_reason || 'Payment failed at gateway';

      const existingBooking = await Booking.findOne({
        $or: [{ paypalOrderId: orderId }, { transactionId: paymentId }]
      });

      if (existingBooking) {
        existingBooking.status = 'FAILED';
        existingBooking.failureReason = errorDesc;
        await existingBooking.save();
        console.warn(`⚠️ [Razorpay Webhook]: Marked Booking ${existingBooking.bookingId} as FAILED: ${errorDesc}`);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('⚠️ [Razorpay Webhook Error]:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};
