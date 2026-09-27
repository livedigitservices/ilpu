import { findBookingById, getBookings, saveBooking, removeBookingFromStore } from '../db/store.js';
import { sendAdminBookingNotification } from '../config/mailer.js';

export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await findBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error('[Get Booking Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch booking details' });
  }
};

export const listBookings = async (req, res) => {
  try {
    const bookings = await getBookings();
    return res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    console.error('[List Bookings Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch bookings list' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const existing = await findBookingById(bookingId);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    await removeBookingFromStore(bookingId);
    return res.status(200).json({ success: true, message: `Booking ${bookingId} deleted successfully` });
  } catch (err) {
    console.error('[Delete Booking Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete booking' });
  }
};

export const createManualBooking = async (req, res) => {
  try {
    const { serviceId, serviceTitle, region, amount, currency, clientDetails } = req.body;

    const bookingId = `ILPU-BKG-${Date.now()}`;
    const amountPaidStr = region === 'india' ? `₹499 + 18% GST (Total ₹589 INR)` : `$5.00 USD`;

    const fullRecord = {
      id: bookingId,
      bookingId: bookingId,
      paypalOrderId: `MANUAL-${Date.now()}`,
      paypalCaptureId: `MANUAL-${Date.now()}`,
      paymentProvider: 'MANUAL_ADMIN',
      paymentMethod: 'ADMIN_DIRECT',
      transactionId: `MANUAL-${Date.now()}`,
      status: 'PAID',
      serviceId: serviceId || 'general-consultation',
      serviceTitle: serviceTitle || '1-on-1 Legal Strategy Consultation',
      region: region || 'india',
      pricingTier: amountPaidStr,
      amount: Number(amount) || (region === 'india' ? 589 : 5),
      currency: currency || (region === 'india' ? 'INR' : 'USD'),
      amountPaid: amountPaidStr,
      clientDetails: clientDetails || {},
      name: clientDetails?.name || 'Client',
      email: clientDetails?.email || '',
      phone: clientDetails?.phone || '',
      country: clientDetails?.country || '',
      details: clientDetails?.notes || '',
      createdAt: new Date().toISOString()
    };

    await saveBooking(fullRecord);
    await sendAdminBookingNotification(fullRecord);

    return res.status(200).json({ success: true, bookingId, booking: fullRecord });
  } catch (err) {
    console.error('[Create Manual Booking Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to create manual booking' });
  }
};
