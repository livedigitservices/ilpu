const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 1. Creates a new PayPal order on the backend (International Clients)
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
 * 2. Captures a completed PayPal order, saves booking to MongoDB, and triggers admin email
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
 * 3. Creates a Razorpay Order for Indian UPI / Card Checkout
 */
export const createRazorpayOrderApi = async ({ serviceId, serviceTitle, region, amount, currency, clientDetails }) => {
  const response = await fetch(`${API_BASE_URL}/razorpay/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serviceId,
      serviceTitle,
      region,
      amount: amount || 589,
      currency: currency || 'INR',
      clientDetails,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to create Razorpay order');
  }

  return data;
};

/**
 * 4. Verifies Razorpay payment signature & records booking
 */
export const verifyRazorpayPaymentApi = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  paymentMethod,
  serviceId,
  serviceTitle,
  region,
  amount,
  currency,
  clientDetails,
}) => {
  const response = await fetch(`${API_BASE_URL}/razorpay/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod,
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
    throw new Error(data.error || 'Failed to verify Razorpay payment');
  }

  return data;
};

/**
 * 5. Direct UPI (Google Pay / PhonePe / Paytm / BHIM) Payment Confirmation
 */
export const verifyDirectUpiPaymentApi = async ({
  utr,
  upiApp,
  serviceId,
  serviceTitle,
  region,
  amount,
  currency,
  clientDetails,
}) => {
  const response = await fetch(`${API_BASE_URL}/upi/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      utr,
      upiApp,
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
    throw new Error(data.error || 'Failed to verify UPI payment');
  }

  return data;
};

/**
 * 6. Fetches a confirmed booking receipt by bookingId
 */
export const getBookingByIdApi = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Booking receipt not found');
  }

  return data.booking || data;
};
