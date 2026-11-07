import {
  findBookingById,
  getBookings,
  saveBooking,
  removeBookingFromStore,
  getServiceWhatsAppLinkFromStore,
  getPricingPlanByIdFromStore,
  getGstConfigFromStore
} from '../db/store.js';
import { sendAdminBookingNotification } from '../config/mailer.js';
import { calculatePricingBreakdown, round2 } from '../utils/pricingEngine.js';

export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await findBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const isPaid = Boolean(
      booking.status === 'PAID' ||
      booking.status === 'COMPLETED' ||
      booking.webhookVerified === true
    );

    let serviceWhatsAppGroupLink = null;
    if (isPaid) {
      const serviceId = booking.serviceId || 'general-consultation';
      serviceWhatsAppGroupLink = booking.whatsappGroupLink || await getServiceWhatsAppLinkFromStore(serviceId);
    }

    return res.status(200).json({
      success: true,
      booking: {
        ...booking,
        serviceWhatsAppGroupLink
      }
    });
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
    const { planId, serviceId, serviceTitle, region = 'india', amount, currency, clientDetails } = req.body;

    const targetIdentifier = planId || serviceId || 'general-consultation';
    let plan = await getPricingPlanByIdFromStore(targetIdentifier);
    if (!plan) plan = await getPricingPlanByIdFromStore('general-consultation');

    const gstConfig = await getGstConfigFromStore();
    const isIndia = region.toLowerCase() === 'india';
    const breakdown = calculatePricingBreakdown(plan, gstConfig, isIndia ? 'india' : 'international');

    const effectiveServiceId = plan?.serviceId || serviceId || 'general-consultation';
    const whatsappLink = await getServiceWhatsAppLinkFromStore(effectiveServiceId);

    const bookingId = `ILPU-BKG-${Date.now()}`;
    const finalAmount = amount !== undefined ? round2(amount) : breakdown.totalAmount;
    const finalCurrency = currency || breakdown.currency;

    const fullRecord = {
      id: bookingId,
      bookingId: bookingId,
      planId: plan?.planId || '',
      paypalOrderId: `MANUAL-${Date.now()}`,
      paypalCaptureId: `MANUAL-${Date.now()}`,
      paymentProvider: 'MANUAL_ADMIN',
      paymentMethod: 'ADMIN_DIRECT',
      transactionId: `MANUAL-${Date.now()}`,
      status: 'PAID',
      serviceId: effectiveServiceId,
      serviceTitle: serviceTitle || plan?.name || '1-on-1 Legal Strategy Consultation',
      region: isIndia ? 'india' : 'international',
      pricingTier: breakdown.displayString,
      basePrice: breakdown.basePrice,
      gstRate: breakdown.gstRate,
      gstAmount: breakdown.gstAmount,
      totalAmount: finalAmount,
      isInclusive: breakdown.isInclusive,
      hsnSacCode: breakdown.hsnSacCode,
      taxName: breakdown.taxName,
      whatsappGroupLink: whatsappLink,
      amount: finalAmount,
      currency: finalCurrency,
      amountPaid: `${finalCurrency === 'USD' ? '$' : '₹'}${finalAmount} ${finalCurrency}`,
      clientDetails: clientDetails || {},
      name: clientDetails?.name || 'Client',
      email: clientDetails?.email || '',
      phone: clientDetails?.phone || '',
      country: clientDetails?.country || (isIndia ? 'India' : 'International'),
      details: clientDetails?.notes || '',
      createdAt: new Date().toISOString()
    };

    await saveBooking(fullRecord);
    sendAdminBookingNotification(fullRecord).catch(mailErr => {
      console.error('⚠️ [Background Mail Dispatch Warning]:', mailErr.message);
    });

    return res.status(201).json({
      success: true,
      bookingId: bookingId,
      booking: fullRecord
    });
  } catch (err) {
    console.error('[Create Manual Booking Error]:', err);
    return res.status(500).json({ error: 'Failed to record manual booking' });
  }
};
