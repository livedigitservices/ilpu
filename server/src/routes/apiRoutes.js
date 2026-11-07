import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook
} from '../controllers/razorpayController.js';
import { verifyDirectUpiPayment } from '../controllers/upiController.js';
import {
  getBooking,
  listBookings,
  deleteBooking,
  createManualBooking
} from '../controllers/bookingController.js';
import {
  listServiceConfigs,
  getServiceConfig,
  updateServiceConfig,
  resetServiceConfig
} from '../controllers/serviceConfigController.js';
import {
  getPublishedPricing,
  getPlanById,
  listAllPricingAdmin,
  createPricingPlan,
  updatePricingPlan,
  togglePlanStatus,
  reorderPricingPlans,
  deletePricingPlan,
  previewPricingCalculation
} from '../controllers/pricingController.js';
import {
  getPublicGstConfig,
  getGstConfigAdmin,
  updateGstConfig
} from '../controllers/gstController.js';
import {
  adminLogin,
  verifyAdminSession,
  getAuditLogs
} from '../controllers/adminAuthController.js';
import { verifyAdminAuth } from '../middleware/auth.js';
import {
  adminLoginLimiter,
  orderCreationLimiter,
  paymentVerificationLimiter
} from '../middleware/security.js';

const router = express.Router();

// ========================================================
// 1. PUBLIC PRICING & GST DIRECTORY (Zero auth required)
// ========================================================
router.get('/pricing', getPublishedPricing);
router.get('/pricing/:id', getPlanById);
router.get('/gst', getPublicGstConfig);

// ========================================================
// 2. ADMIN AUTHENTICATION & SESSION MANAGEMENT
// ========================================================
router.post('/admin/login', adminLoginLimiter, adminLogin);
router.get('/admin/session', verifyAdminAuth, verifyAdminSession);
router.get('/admin/audit-logs', verifyAdminAuth, getAuditLogs);

// ========================================================
// 3. ADMIN DYNAMIC PRICING CRUD & CONFIGURATION
// ========================================================
router.get('/admin/pricing', verifyAdminAuth, listAllPricingAdmin);
router.post('/admin/pricing', verifyAdminAuth, createPricingPlan);
router.put('/admin/pricing/reorder', verifyAdminAuth, reorderPricingPlans);
router.post('/admin/pricing/preview', verifyAdminAuth, previewPricingCalculation);
router.put('/admin/pricing/:planId', verifyAdminAuth, updatePricingPlan);
router.patch('/admin/pricing/:planId/status', verifyAdminAuth, togglePlanStatus);
router.delete('/admin/pricing/:planId', verifyAdminAuth, deletePricingPlan);

// ========================================================
// 4. ADMIN DYNAMIC GST CONFIGURATION
// ========================================================
router.get('/admin/gst', verifyAdminAuth, getGstConfigAdmin);
router.put('/admin/gst', verifyAdminAuth, updateGstConfig);

// ========================================================
// 5. SERVICE-SPECIFIC WHATSAPP LINKS MANAGEMENT
// ========================================================
router.get('/services/whatsapp-links', listServiceConfigs);
router.get('/services/whatsapp-links/:serviceId', getServiceConfig);
router.put('/services/whatsapp-links/:serviceId', verifyAdminAuth, updateServiceConfig);
router.delete('/services/whatsapp-links/:serviceId', verifyAdminAuth, resetServiceConfig);

// ========================================================
// 6. RAZORPAY PAYMENT GATEWAY ROUTES
// ========================================================
router.post('/razorpay/create-order', orderCreationLimiter, createRazorpayOrder);
router.post('/razorpay/verify-payment', paymentVerificationLimiter, verifyRazorpayPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

// ========================================================
// 7. DIRECT UPI (GPay / PhonePe / Paytm / BHIM) VERIFICATION
// ========================================================
router.post('/upi/verify-payment', paymentVerificationLimiter, verifyDirectUpiPayment);

// ========================================================
// 8. BOOKING RECEIPT & ADMIN MANAGEMENT ROUTES
// ========================================================
router.get('/bookings/:bookingId', getBooking); // Public receipt access by customer booking ID
router.get('/bookings', verifyAdminAuth, listBookings);
router.delete('/bookings/:bookingId', verifyAdminAuth, deleteBooking);
router.post('/bookings/manual', verifyAdminAuth, createManualBooking);

export default router;
