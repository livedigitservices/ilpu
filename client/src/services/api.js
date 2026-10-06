const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

/**
 * 7. Fetches list of all bookings for Admin Dashboard
 */
export const listBookingsApi = async () => {
  const response = await fetch(`${API_BASE_URL}/bookings`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch bookings list');
  }

  return data.bookings || [];
};

/**
 * 8. Deletes a booking record by ID
 */
export const deleteBookingApi = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete booking');
  }

  return data;
};

/**
 * 9. Creates a manual booking record directly from Admin Dashboard
 */
export const createManualBookingApi = async ({ serviceId, serviceTitle, region, amount, currency, clientDetails }) => {
  const response = await fetch(`${API_BASE_URL}/bookings/manual`, {
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
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to create manual booking');
  }

  return data;
};

/**
 * Helper to safely handle non-JSON responses (e.g. 404 HTML pages from un-deployed Render backend)
 */
const parseJsonResponse = async (response, fallbackErrorMessage) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Backend server on Render is running an older deployment. Please push the latest backend code to GitHub/Render to activate the new WhatsApp API endpoints.');
  }
  const data = await response.json();
  if (!response.ok || (data && data.success === false)) {
    throw new Error(data?.error || fallbackErrorMessage);
  }
  return data;
};

/**
 * 10. List all Service-Specific WhatsApp Group Configurations
 */
export const listServiceConfigsApi = async () => {
  const response = await fetch(`${API_BASE_URL}/services/whatsapp-links`);
  const data = await parseJsonResponse(response, 'Failed to fetch service WhatsApp configurations');
  return data.configs || [];
};

/**
 * 11. Update or Create Service-Specific WhatsApp Group Link
 */
export const updateServiceConfigApi = async (serviceId, { whatsappGroupLink, whatsappChannelName, serviceTitle }) => {
  const response = await fetch(`${API_BASE_URL}/services/whatsapp-links/${serviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      whatsappGroupLink,
      whatsappChannelName,
      serviceTitle
    }),
  });

  return await parseJsonResponse(response, 'Failed to update service WhatsApp configuration');
};

/**
 * 12. Reset Service-Specific WhatsApp Group Link back to default
 */
export const resetServiceConfigApi = async (serviceId) => {
  const response = await fetch(`${API_BASE_URL}/services/whatsapp-links/${serviceId}`, {
    method: 'DELETE',
  });

  return await parseJsonResponse(response, 'Failed to reset service configuration');
};
