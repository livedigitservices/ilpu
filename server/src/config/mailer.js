import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Initialize SMTP Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass && pass !== 'your_smtp_app_password') {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Fallback test account transporter when SMTP credentials are not active yet
  return null;
};

export const sendAdminBookingNotification = async (bookingDetails) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ilpulegal.com';
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #060b18; color: #e2e8f0; padding: 20px; }
        .card { background-color: #0a1128; border: 1px solid #d4af37; border-radius: 12px; padding: 25px; max-width: 600px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px; }
        .title { color: #f3d079; font-size: 22px; margin: 0; }
        .subtitle { color: #94a3b8; font-size: 13px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
        .label { color: #94a3b8; font-weight: 600; }
        .value { color: #ffffff; text-align: right; font-weight: 500; }
        .badge { background: #d4af37; color: #060b18; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }
        .footer { text-align: center; margin-top: 25px; color: #64748b; font-size: 11px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 class="title">⚡ NEW LEGAL BOOKING & PAYMENT RECEIVED</h2>
          <p class="subtitle">International Legal Processing Unit (ILPU) • Strategy Chambers</p>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <span class="badge">PAYMENT VERIFIED & CONFIRMED</span>
        </div>

        <div class="row"><span class="label">Booking ID:</span><span class="value">${bookingDetails.id || bookingDetails.bookingId}</span></div>
        <div class="row"><span class="label">PayPal Order ID:</span><span class="value">${bookingDetails.paypalOrderId || 'CONFIRMED'}</span></div>
        <div class="row"><span class="label">Client Name:</span><span class="value">${bookingDetails.name}</span></div>
        <div class="row"><span class="label">Client Email:</span><span class="value">${bookingDetails.email}</span></div>
        <div class="row"><span class="label">Phone / WhatsApp:</span><span class="value">${bookingDetails.phone}</span></div>
        <div class="row"><span class="label">Country:</span><span class="value">${bookingDetails.country}</span></div>
        <div class="row"><span class="label">Service Selected:</span><span class="value">${bookingDetails.serviceTitle}</span></div>
        <div class="row"><span class="label">Region & Pricing:</span><span class="value">${bookingDetails.pricingTier}</span></div>
        <div class="row"><span class="label">Amount Paid:</span><span class="value" style="color: #4ade80; font-weight: bold;">${bookingDetails.amountPaid}</span></div>
        <div class="row"><span class="label">Matter Description:</span><span class="value">${bookingDetails.details || 'N/A'}</span></div>
        <div class="row"><span class="label">Timestamp:</span><span class="value">${new Date().toLocaleString()}</span></div>

        <div class="footer">
          This notification was automatically dispatched to process.env.ADMIN_EMAIL (${adminEmail}).<br/>
          ILPU Chambers • Hyderabad, India & Global Jurisdictions
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"ILPU Legal Server" <${process.env.SMTP_USER || 'no-reply@ilpulegal.com'}>`,
    to: adminEmail,
    subject: `⚡ [PAID BOOKING] ${bookingDetails.serviceTitle} - ${bookingDetails.name}`,
    html: htmlContent
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[SMTP Mailer] Booking email successfully sent to ${adminEmail}. MessageID:`, info.messageId);
      return true;
    } catch (err) {
      console.error("[SMTP Mailer Error] Failed to send email via SMTP:", err.message);
      return false;
    }
  } else {
    console.log(`[SMTP Mailer Notice] Real SMTP credentials not configured in .env. Admin email notification logged for ${adminEmail}:`);
    console.log(`- Service: ${bookingDetails.serviceTitle}`);
    console.log(`- Client: ${bookingDetails.name} (${bookingDetails.phone})`);
    console.log(`- Amount Paid: ${bookingDetails.amountPaid}`);
    return true;
  }
};
