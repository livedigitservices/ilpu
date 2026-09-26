import dotenv from 'dotenv';
import { saveBooking } from '../db/store.js';
import { sendAdminBookingNotification } from '../config/mailer.js';

dotenv.config();

const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
const PAYPAL_BASE_URL = PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Helper to get PayPal Access Token from PayPal REST API
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId.startsWith('sb-test-client-id')) {
    return null; // Development mode
  }

  try {
    const auth = Buffer.from(`${clientId.trim()}:${clientSecret.trim()}`).toString('base64');
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      console.error(`⚠️ [PayPal Auth Failed (${PAYPAL_MODE})]:`, data.error_description || data.error || 'Authentication failed');
      return null;
    }
  } catch (err) {
    console.error('[PayPal Token Network Error]:', err.message);
    return null;
  }
}

export const createPayPalOrder = async (req, res) => {
  try {
    const { serviceId, serviceTitle, region, amount, currency } = req.body;

    const token = await getPayPalAccessToken();
    const orderValue = amount ? String(amount) : (region === 'india' ? '7' : '5');
    const orderCurrency = 'USD';

    if (!token) {
      console.error('⚠️ [PayPal Order Failure]: Invalid PayPal Client ID / Secret credentials in server/.env');
      return res.status(400).json({
        error: 'PayPal authentication failed. Please verify your PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in server/.env, or use the "Confirm Booking" button below.'
      });
    }

    // Execute live/sandbox REST API call to PayPal
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: orderCurrency,
              value: orderValue,
            },
            description: `ILPU Legal Strategy Consultation - ${serviceTitle || 'Legal Service'}`,
          },
        ],
      }),
    });

    const orderData = await response.json();
    if (!response.ok || !orderData.id) {
      console.error('⚠️ [PayPal Order Creation Error]:', orderData);
      return res.status(response.status || 400).json({
        error: orderData.message || 'PayPal API failed to create order',
        details: orderData
      });
    }

    return res.status(200).json({
      orderID: orderData.id,
      id: orderData.id,
      ...orderData
    });

  } catch (err) {
    console.error('[Create PayPal Order Error]:', err);
    return res.status(500).json({ error: 'Failed to create PayPal order' });
  }
};

export const capturePayPalOrder = async (req, res) => {
  try {
    const {
      orderID,
      serviceId,
      serviceTitle,
      region,
      amount,
      currency,
      clientDetails,
      bookingData
    } = req.body;

    const token = await getPayPalAccessToken();
    let captureResult = { status: 'COMPLETED', id: orderID };

    if (token && orderID && !orderID.startsWith('MOCK-ORD-')) {
      const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      captureResult = await response.json();
    }

    const effectiveServiceId = serviceId || (bookingData && bookingData.serviceId) || 'general-consultation';
    const effectiveServiceTitle = serviceTitle || (bookingData && bookingData.serviceTitle) || '1-on-1 Legal Strategy Consultation';
    const effectiveRegion = region || (bookingData && bookingData.region) || 'india';
    
    const client = clientDetails || bookingData || {};
    const name = client.name || 'Client';
    const email = client.email || 'client@example.com';
    const phone = client.phone || 'N/A';
    const country = client.country || 'India';
    const notes = client.notes || client.details || '';

    const effectiveAmount = amount || (effectiveRegion === 'india' ? 589 : 5);
    const effectiveCurrency = currency || (effectiveRegion === 'india' ? 'INR' : 'USD');
    const amountPaidStr = effectiveRegion === 'india'
      ? `₹499 + 18% GST (Total ₹589 INR)`
      : `$5.00 USD`;

    const bookingId = `ILPU-BKG-${Date.now()}`;

    const fullBookingRecord = {
      id: bookingId,
      bookingId: bookingId,
      paypalOrderId: orderID || captureResult.id || `MOCK-ORD-${Date.now()}`,
      paypalCaptureId: captureResult.id || orderID || `MOCK-CAP-${Date.now()}`,
      status: 'PAID',
      serviceId: effectiveServiceId,
      serviceTitle: effectiveServiceTitle,
      region: effectiveRegion,
      pricingTier: amountPaidStr,
      amount: effectiveAmount,
      currency: effectiveCurrency,
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
      createdAt: new Date().toISOString(),
    };

    // 1. Save to MongoDB & persistent backup storage
    await saveBooking(fullBookingRecord);

    // 2. Automatically dispatch email to ADMIN_EMAIL (process.env.ADMIN_EMAIL)
    await sendAdminBookingNotification(fullBookingRecord);

    return res.status(200).json({
      success: true,
      bookingId: bookingId,
      booking: fullBookingRecord,
    });
  } catch (err) {
    console.error('[Capture PayPal Order Error]:', err);
    return res.status(500).json({ error: 'Failed to capture PayPal payment' });
  }
};
