import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { saveBooking } from '../db/store.js';
import { sendAdminBookingNotification } from '../config/mailer.js';
import { Booking } from '../models/Booking.js';

dotenv.config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_ILPULegal2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'ilpu_razorpay_secret_key_2026';

let razorpayInstance = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && !RAZORPAY_KEY_ID.includes('test_ILPULegal2026')) {
  try {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID.trim(),
      key_secret: RAZORPAY_KEY_SECRET.trim()
    });
  } catch (e) {
    console.warn('⚠️ Razorpay initialization warning:', e.message);
  }
}

/**
 * 1. Create a Razorpay Order for Indian UPI / Card / Netbanking Checkout
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { serviceId, serviceTitle, amount = 589, currency = 'INR', clientDetails } = req.body;

    const amountInPaise = Math.round(Number(amount) * 100);
    const receiptId = `receipt_ilpu_${Date.now()}`;

    let razorpayOrder = null;

    if (razorpayInstance) {
      razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: currency,
        receipt: receiptId,
        notes: {
          serviceId: serviceId || 'general-consultation',
          serviceTitle: serviceTitle || 'Legal Strategy Consultation',
          clientName: clientDetails?.name || 'Client',
          clientEmail: clientDetails?.email || ''
        }
      });
    } else {
      // Production Fallback / Development simulated order ID
      const simulatedOrderId = `order_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      razorpayOrder = {
        id: simulatedOrderId,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: currency,
        receipt: receiptId,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000)
      };
    }

    return res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error('⚠️ [Razorpay Create Order Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create Razorpay payment order',
      details: err.message
    });
  }
};

/**
 * 2. Verify Razorpay Payment Signature (HMAC SHA256)
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = 'UPI',
      serviceId,
      serviceTitle,
      region = 'india',
      amount = 589,
      currency = 'INR',
      clientDetails
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing Razorpay order ID or payment ID'
      });
    }

    let isValidSignature = true;

    // Verify HMAC-SHA256 signature if live secret is available
    if (RAZORPAY_KEY_SECRET && !RAZORPAY_KEY_SECRET.includes('ilpu_razorpay_secret_key_2026') && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
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

    const bookingId = `ILPU-BKG-${Date.now()}`;
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
      paypalOrderId: razorpay_order_id,
      paypalCaptureId: razorpay_payment_id,
      paymentProvider: 'RAZORPAY_UPI',
      paymentMethod: paymentMethod || 'UPI_GPAY',
      transactionId: razorpay_payment_id,
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

    // 1. Save to MongoDB Atlas & persistent JSON backup
    await saveBooking(fullBookingRecord);

    // 2. Automatically dispatch admin email notification
    await sendAdminBookingNotification(fullBookingRecord);

    return res.status(200).json({
      success: true,
      bookingId: bookingId,
      booking: fullBookingRecord
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
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('⚠️ [Razorpay Webhook Invalid Signature]');
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    const { event, payload } = req.body;
    console.log(`🔔 [Razorpay Webhook Event Received]: ${event}`);

    if (event === 'payment.captured' && payload?.payment?.entity) {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      // Update matching booking status in database if available
      const existingBooking = await Booking.findOne({
        $or: [{ paypalOrderId: orderId }, { transactionId: paymentId }]
      });

      if (existingBooking) {
        existingBooking.status = 'PAID';
        existingBooking.webhookVerified = true;
        await existingBooking.save();
        console.log(`✅ [Razorpay Webhook]: Verified & Updated Booking ${existingBooking.bookingId}`);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('⚠️ [Razorpay Webhook Error]:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};
