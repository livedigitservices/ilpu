import express from 'express';
import { createPayPalOrder, capturePayPalOrder } from '../controllers/paypalController.js';
import { createRazorpayOrder, verifyRazorpayPayment, handleRazorpayWebhook } from '../controllers/razorpayController.js';
import { verifyDirectUpiPayment } from '../controllers/upiController.js';
import { getBooking, listBookings } from '../controllers/bookingController.js';

const router = express.Router();

// 1. PayPal Payment Routes (International Clients)
router.post('/paypal/create-order', createPayPalOrder);
router.post('/paypal/capture-order', capturePayPalOrder);

// 2. Razorpay Payment Routes (India Resident UPI / Cards / Netbanking)
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify-payment', verifyRazorpayPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

// 3. Direct UPI Intent & QR Routes (GPay / PhonePe / Paytm / BHIM)
router.post('/upi/verify-payment', verifyDirectUpiPayment);

// 4. Booking Data & Receipt Routes
router.get('/bookings/:bookingId', getBooking);
router.get('/bookings', listBookings);

export default router;
