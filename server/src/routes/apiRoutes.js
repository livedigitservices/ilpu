import express from 'express';
import { createPayPalOrder, capturePayPalOrder } from '../controllers/paypalController.js';
import { getBooking, listBookings } from '../controllers/bookingController.js';

const router = express.Router();

// PayPal Payment API Routes
router.post('/paypal/create-order', createPayPalOrder);
router.post('/paypal/capture-order', capturePayPalOrder);

// Booking Data API Routes
router.get('/bookings/:bookingId', getBooking);
router.get('/bookings', listBookings);

export default router;
