import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, handleRazorpayWebhook } from '../controllers/razorpayController.js';
import { verifyDirectUpiPayment } from '../controllers/upiController.js';
import { getBooking, listBookings, deleteBooking, createManualBooking } from '../controllers/bookingController.js';

const router = express.Router();

// 2. Razorpay Payment Routes (India Resident UPI / Cards / Netbanking)
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify-payment', verifyRazorpayPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

// 3. Direct UPI Intent & QR Routes (GPay / PhonePe / Paytm / BHIM)
router.post('/upi/verify-payment', verifyDirectUpiPayment);

// 4. Booking Data CRUD & Receipt Routes
router.get('/bookings/:bookingId', getBooking);
router.get('/bookings', listBookings);
router.delete('/bookings/:bookingId', deleteBooking);
router.post('/bookings/manual', createManualBooking);

export default router;
