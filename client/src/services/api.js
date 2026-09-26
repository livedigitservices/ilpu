// Centralized API Service for Frontend-to-Backend Communication
const API_BASE_URL = 'https://ilpu.onrender.com/api';

/**
 * Creates a new PayPal order on the backend
 */
export const createPayPalOrderApi = async ({ serviceId, serviceTitle, region, amount, currency, clientDetails }) => {
  const response = await fetch(`${API_BASE_URL}/paypal/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serviceId,
      serviceTitle,
      region,
      amount,
      currency,
      clientDetails,
    }),
  });

  const data = await response.json();
  if (!response.ok || (!data.orderID && !data.id)) {
    throw new Error(data.error || 'Failed to create payment order');
  }

  return data.orderID || data.id;
};

/**
 * Captures a completed PayPal order, saves booking to MongoDB, and triggers admin email
 */
export const capturePayPalOrderApi = async ({ orderID, serviceId, serviceTitle, region, amount, currency, clientDetails }) => {
  const response = await fetch(`${API_BASE_URL}/paypal/capture-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderID,
      serviceId,
      serviceTitle,
      region,
      amount,
      currency,
      clientDetails,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to capture payment order');
  }

  return data;
};

/**
 * Fetches a confirmed booking receipt by bookingId
 */
export const getBookingByIdApi = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Booking receipt not found');
  }

  return data.booking || data;
};
