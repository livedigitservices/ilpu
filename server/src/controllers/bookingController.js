import { findBookingById, getBookings } from '../db/store.js';

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
