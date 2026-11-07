const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fallback initial pricing plans used when backend is deploying or updating on Render
export const FALLBACK_PLANS = [
  {
    planId: 'plan_international-law-business',
    serviceId: 'international-law-business',
    name: 'International Law & Global Business Advisory',
    subtitle: 'Helping businesses understand the legal side of going global',
    description: 'Empowering businesses to navigate complex international legal frameworks with confidence. From import-export compliance to cross-border acquisitions and dispute prevention.',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 2999,
    priceInternational: 5,
    originalPriceInternational: 35,
    badge: 'Global Markets',
    features: [
      'Cross-Border Legal Guidance & Regulatory Frameworks',
      'Import-Export, Foreign Trade & Maritime Compliance',
      'Foreign Business Transactions & Cross-Border Mergers',
      'International Commercial Dispute Resolution & Arbitration',
      'Regulatory Coordination between India & International Markets'
    ],
    deliverables: [
      'Cross-border transaction risk audit',
      'International trade agreement compliance check',
      'Foreign direct investment (FDI) legal structuring',
      'Customs and regulatory filings guidance'
    ],
    isActive: true,
    sortOrder: 1,
    calculations: {
      india: { basePrice: 499, gstRate: 18, gstAmount: 89.82, totalAmount: 588.82, formattedBase: '₹499', formattedTotal: '₹589 INR', displayString: '₹499 + 18% GST (Total ₹589)' },
      international: { basePrice: 5, gstRate: 0, gstAmount: 0, totalAmount: 5, formattedBase: '$5', formattedTotal: '$5.00 USD', displayString: '$5 USD' }
    }
  },
  {
    planId: 'plan_nri-property-protection',
    serviceId: 'nri-property-protection',
    name: 'NRI Property Protection & Legal Solutions',
    subtitle: 'Guarding ancestral land, estates, and title deeds across India',
    description: 'Comprehensive legal advisory for non-resident Indians facing land disputes, illegal encroachment, mutation obstacles, or title fraud across India.',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 4999,
    priceInternational: 5,
    originalPriceInternational: 60,
    badge: 'NRI Priority',
    features: [
      'Ancestral Property & Land Dispute Resolution',
      'Illegal Encroachment Defense & Eviction Proceedings',
      'Title Verification, Mutation & Revenue Record Rectification',
      'Power of Attorney (POA) Drafting, Validation & Registration',
      'Direct Representation before District & High Courts across India'
    ],
    deliverables: [
      'Title and ownership risk verification audit',
      'Encroachment eviction strategy and notice drafting',
      'Revenue record mutation verification roadmap',
      'Power of Attorney validation protocol'
    ],
    isActive: true,
    sortOrder: 2,
    calculations: {
      india: { basePrice: 499, gstRate: 18, gstAmount: 89.82, totalAmount: 588.82, formattedBase: '₹499', formattedTotal: '₹589 INR', displayString: '₹499 + 18% GST (Total ₹589)' },
      international: { basePrice: 5, gstRate: 0, gstAmount: 0, totalAmount: 5, formattedBase: '$5', formattedTotal: '$5.00 USD', displayString: '$5 USD' }
    }
  },
  {
    planId: 'plan_contract-drafting',
    serviceId: 'contract-drafting',
    name: 'International Contract Drafting & Frameworks',
    subtitle: 'Ironclad cross-border agreements that protect your interests globally',
    description: 'Precision multijurisdictional contract drafting, vendor SLAs, IP licensing, and non-disclosure agreements designed for cross-border enforceability.',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 3499,
    priceInternational: 5,
    originalPriceInternational: 45,
    badge: 'Commercial Law',
    features: [
      'Cross-Border Commercial Contracts & Master Service Agreements (MSAs)',
      'International Joint Venture, Shareholder & Partnership Deeds',
      'Vendor Agreements, SLAs & Cross-Border Supply Contracts',
      'IP Licensing, Technology Transfer & Non-Disclosure Agreements (NDAs)',
      'Arbitration Clause Structuring (Singapore SIAC, London LCIA, India ICA)'
    ],
    deliverables: [
      'Tailored cross-border contract draft',
      'Jurisdiction and governing law clause analysis',
      'Dispute resolution and arbitration blueprint',
      'Risk exposure and limitation of liability review'
    ],
    isActive: true,
    sortOrder: 3,
    calculations: {
      india: { basePrice: 499, gstRate: 18, gstAmount: 89.82, totalAmount: 588.82, formattedBase: '₹499', formattedTotal: '₹589 INR', displayString: '₹499 + 18% GST (Total ₹589)' },
      international: { basePrice: 5, gstRate: 0, gstAmount: 0, totalAmount: 5, formattedBase: '$5', formattedTotal: '$5.00 USD', displayString: '$5 USD' }
    }
  },
  {
    planId: 'plan_investment-opportunities',
    serviceId: 'investment-opportunities',
    name: 'International Investment & Wealth Protection',
    subtitle: 'Strategic counsel for global ventures, FDI, and offshore holdings',
    description: 'Navigating foreign direct investment (FDI), FEMA compliance, repatriation of funds, and legal asset protection for high-net-worth individuals and corporate investors.',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 4999,
    priceInternational: 5,
    originalPriceInternational: 60,
    badge: 'FDI & Wealth',
    features: [
      'Foreign Direct Investment (FDI) & ODI Structuring under FEMA',
      'Offshore Holding Structures & Global Asset Protection',
      'Cross-Border Mergers, Acquisitions & Due Diligence Audits',
      'Repatriation of Funds, NRE/NRO Account Legal Compliance',
      'RBI, SEBI & International Financial Services Centre (IFSC) Advisory'
    ],
    deliverables: [
      'FEMA and FDI compliance verification report',
      'Cross-border fund repatriation roadmap',
      'Asset holding structure legal evaluation',
      'Regulatory clearance checklist'
    ],
    isActive: true,
    sortOrder: 4,
    calculations: {
      india: { basePrice: 499, gstRate: 18, gstAmount: 89.82, totalAmount: 588.82, formattedBase: '₹499', formattedTotal: '₹589 INR', displayString: '₹499 + 18% GST (Total ₹589)' },
      international: { basePrice: 5, gstRate: 0, gstAmount: 0, totalAmount: 5, formattedBase: '$5', formattedTotal: '$5.00 USD', displayString: '$5 USD' }
    }
  },
  {
    planId: 'plan_immigration-roadmap',
    serviceId: 'immigration-roadmap',
    name: 'Immigration & Emigration Roadmap Advisory',
    subtitle: 'Clear, compliant legal paths for global mobility, visas & residency',
    description: 'Strategic legal counsel on global migration, investor visas, citizenship by investment, skilled professional pathways, and appeal against visa refusals.',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 3999,
    priceInternational: 5,
    originalPriceInternational: 50,
    badge: 'Global Mobility',
    features: [
      '9-Step Personalised Global Mobility & Emigration Roadmap',
      'Investor Visas, Golden Visas & Citizenship by Investment Pathways',
      'Work Permits, Intra-Company Transfers & Skilled Migration',
      'Visa Refusal Appeals, Administrative Reviews & Judicial Relief',
      'Dual Citizenship, OCI Card & Passport Compliance Advisory'
    ],
    deliverables: [
      'Personalised 9-step emigration roadmap report',
      'Visa eligibility and points audit',
      'Refusal risk mitigation strategy',
      'Document checklist for target consulate'
    ],
    isActive: true,
    sortOrder: 5,
    calculations: {
      india: { basePrice: 499, gstRate: 18, gstAmount: 89.82, totalAmount: 588.82, formattedBase: '₹499', formattedTotal: '₹589 INR', displayString: '₹499 + 18% GST (Total ₹589)' },
      international: { basePrice: 5, gstRate: 0, gstAmount: 0, totalAmount: 5, formattedBase: '$5', formattedTotal: '$5.00 USD', displayString: '$5 USD' }
    }
  },
  {
    planId: 'plan_life-after-divorce',
    serviceId: 'life-after-divorce',
    name: 'Family Law & Life After Divorce Advisory',
    subtitle: 'Compassionate, confidential legal guidance for cross-border families',
    description: 'Empathetic legal strategy for individuals navigating separation, cross-border child custody, asset division, alimony, and multijurisdictional matrimonial decrees.',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 2999,
    priceInternational: 5,
    originalPriceInternational: 35,
    badge: 'Family Law',
    features: [
      'Cross-Border Child Custody & Hague Convention Advisory',
      'Equitable Asset Division, Property Settlement & Alimony',
      'Mutual Consent Divorce & Contested Matrimonial Proceedings',
      'Domestic Violence Act & Dowry Prohibition Defense Counsel',
      'Recognition of Foreign Divorce Decrees in Indian Courts'
    ],
    deliverables: [
      'Matrimonial dispute resolution strategy blueprint',
      'Cross-border child custody rights assessment',
      'Asset and alimony entitlement calculation guide',
      'Foreign decree enforceability review'
    ],
    isActive: true,
    sortOrder: 6,
    calculations: {
      india: { basePrice: 499, gstRate: 18, gstAmount: 89.82, totalAmount: 588.82, formattedBase: '₹499', formattedTotal: '₹589 INR', displayString: '₹499 + 18% GST (Total ₹589)' },
      international: { basePrice: 5, gstRate: 0, gstAmount: 0, totalAmount: 5, formattedBase: '$5', formattedTotal: '$5.00 USD', displayString: '$5 USD' }
    }
  },
  {
    planId: 'plan_general-consultation',
    serviceId: 'general-consultation',
    name: '1-on-1 Legal Strategy Consultation',
    subtitle: 'Direct Confidential Legal Counsel with Dr. Karanam Rajesh Kumar',
    description: 'Direct 30-minute legal strategy session covering NRI rights, corporate dispute risk audits, cross-border contracts, or international legal questions.',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 1999,
    priceInternational: 5,
    originalPriceInternational: 25,
    badge: 'Priority Advisory',
    features: [
      '30-Minute 1-on-1 Legal Strategy Session with Dr. Karanam Rajesh Kumar',
      'Complete Legal Risk Audit & Key Document Assessment',
      'Jurisdictional Alignment under Indian & International Law',
      'Actionable Legal Next Steps & Embassy / Court Protocol'
    ],
    deliverables: [
      'Custom Legal Opinion & Strategy Summary Document',
      'Embassy / Court Filing Checklist & Template Guidance',
      'Direct Priority Follow-Up Protocol'
    ],
    isActive: true,
    sortOrder: 7,
    calculations: {
      india: { basePrice: 499, gstRate: 18, gstAmount: 89.82, totalAmount: 588.82, formattedBase: '₹499', formattedTotal: '₹589 INR', displayString: '₹499 + 18% GST (Total ₹589)' },
      international: { basePrice: 5, gstRate: 0, gstAmount: 0, totalAmount: 5, formattedBase: '$5', formattedTotal: '$5.00 USD', displayString: '$5 USD' }
    }
  }
];

export const FALLBACK_GST = {
  configId: 'global_gst_config',
  gstEnabled: true,
  defaultRate: 18,
  isInclusive: false,
  hsnSacCode: '998211',
  taxName: 'GST',
  description: 'Goods and Services Tax (GST) applicable on legal consultancy under SAC 998211'
};

/**
 * Returns authorization headers for authenticated Admin requests
 */
const getAdminHeaders = (extraHeaders = {}) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('ilpu_admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders
  };
};

/**
 * Helper to safely handle responses
 */
const handleResponse = async (response, fallbackErrorMessage) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Backend server returned non-JSON response. Please verify the API connection.');
  }
  const data = await response.json();
  if (!response.ok || (data && data.success === false)) {
    throw new Error(data?.error || fallbackErrorMessage);
  }
  return data;
};

// ========================================================
// 1. ADMIN AUTHENTICATION
// ========================================================

/**
 * Validates admin passcode. Supports live backend HMAC verification with graceful fallback
 * while remote Render web service deployment is pending.
 */
export const adminLoginApi = async (passcode) => {
  const adminPasscode = (import.meta.env.VITE_ADMIN_PASSCODE || 'ilpu2026').trim();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || 'Invalid administrator passcode');
      }
      if (data.token) {
        sessionStorage.setItem('ilpu_admin_token', data.token);
        sessionStorage.setItem('ilpu_admin_authed', 'true');
      }
      return data;
    }

    // Render returned 404 HTML (backend code has not been pushed to GitHub/Render yet)
    if (response.status === 404 || !contentType.includes('application/json')) {
      if (passcode.trim() === adminPasscode) {
        const token = 'token_local_bridge_' + Date.now();
        sessionStorage.setItem('ilpu_admin_token', token);
        sessionStorage.setItem('ilpu_admin_authed', 'true');
        return {
          success: true,
          token,
          isPendingDeployment: true,
          message: 'Authenticated. Note: Remote Render backend deployment is pending.'
        };
      } else {
        throw new Error('Invalid Administrator Passcode. Please verify and try again.');
      }
    }
  } catch (err) {
    if (err.message && err.message.includes('Invalid Administrator Passcode')) {
      throw err;
    }
    // If remote connection returned HTML 404 or network error, verify against configured passcode
    if (passcode.trim() === adminPasscode) {
      const token = 'token_local_bridge_' + Date.now();
      sessionStorage.setItem('ilpu_admin_token', token);
      sessionStorage.setItem('ilpu_admin_authed', 'true');
      return {
        success: true,
        token,
        isPendingDeployment: true,
        message: 'Authenticated. Note: Remote Render backend deployment is pending.'
      };
    }
    throw new Error(err.message || 'Invalid administrator passcode');
  }
};

/**
 * Verifies active admin session
 */
export const verifyAdminSessionApi = async () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('ilpu_admin_token') : null;
  if (!token) throw new Error('No active session token');

  if (token.startsWith('token_local_bridge_')) {
    return { success: true, authenticated: true };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/session`, {
      headers: getAdminHeaders()
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    if (sessionStorage.getItem('ilpu_admin_authed') === 'true') {
      return { success: true, authenticated: true };
    }
  } catch (e) {
    if (sessionStorage.getItem('ilpu_admin_authed') === 'true') {
      return { success: true, authenticated: true };
    }
    throw e;
  }
};

/**
 * Logs out admin and clears stored session credentials
 */
export const adminLogout = () => {
  sessionStorage.removeItem('ilpu_admin_token');
  sessionStorage.removeItem('ilpu_admin_authed');
};

// ========================================================
// 2. PUBLIC PRICING & GST DIRECTORY
// ========================================================

/**
 * Fetches all active published pricing plans with pre-calculated India & International GST
 */
export const getPublicPricingApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pricing`);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.plans)) {
        return data.plans;
      }
    }
  } catch (e) {
    console.warn('Backend pricing endpoint pending on Render, using fallback:', e.message);
  }
  return FALLBACK_PLANS;
};

/**
 * Fetches single plan details with calculations by planId or serviceId
 */
export const getPublicPlanApi = async (planOrServiceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pricing/${planOrServiceId}`);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data.plan) {
        return data.plan;
      }
    }
  } catch (e) {
    console.warn('Backend single plan endpoint pending on Render, using fallback:', e.message);
  }
  return FALLBACK_PLANS.find((p) => p.serviceId === planOrServiceId || p.planId === planOrServiceId) || FALLBACK_PLANS[0];
};

/**
 * Fetches public GST settings
 */
export const getPublicGstConfigApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/gst`);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data.gstConfig) {
        return data.gstConfig;
      }
    }
  } catch (e) {
    console.warn('Backend GST endpoint pending on Render, using fallback:', e.message);
  }
  return FALLBACK_GST;
};

// ========================================================
// 3. ADMIN DYNAMIC PRICING CRUD
// ========================================================

export const listAllPricingAdminApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/pricing`, {
      headers: getAdminHeaders()
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data.success) {
        return {
          plans: data.plans || FALLBACK_PLANS,
          gstConfig: data.gstConfig || FALLBACK_GST
        };
      }
    }
  } catch (e) {
    console.warn('Backend admin pricing pending deployment on Render, using initial plans:', e.message);
  }
  return {
    plans: FALLBACK_PLANS,
    gstConfig: FALLBACK_GST,
    isPendingDeployment: true
  };
};

export const createPricingPlanApi = async (planData) => {
  const response = await fetch(`${API_BASE_URL}/admin/pricing`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(planData)
  });
  return await handleResponse(response, 'Failed to create pricing plan');
};

export const updatePricingPlanApi = async (planId, planData) => {
  const response = await fetch(`${API_BASE_URL}/admin/pricing/${planId}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(planData)
  });
  return await handleResponse(response, 'Failed to update pricing plan');
};

export const togglePlanStatusApi = async (planId, isActive) => {
  const response = await fetch(`${API_BASE_URL}/admin/pricing/${planId}/status`, {
    method: 'PATCH',
    headers: getAdminHeaders(),
    body: JSON.stringify({ isActive })
  });
  return await handleResponse(response, 'Failed to update plan status');
};

export const reorderPricingPlansApi = async (orderedPlanIds) => {
  const response = await fetch(`${API_BASE_URL}/admin/pricing/reorder`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify({ orderedPlanIds })
  });
  return await handleResponse(response, 'Failed to reorder pricing plans');
};

export const deletePricingPlanApi = async (planId) => {
  const response = await fetch(`${API_BASE_URL}/admin/pricing/${planId}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  return await handleResponse(response, 'Failed to delete pricing plan');
};

export const previewPricingCalculationApi = async ({ plan, gstConfigOverride, region }) => {
  const response = await fetch(`${API_BASE_URL}/admin/pricing/preview`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify({ plan, gstConfigOverride, region })
  });
  const data = await handleResponse(response, 'Failed to compute pricing preview');
  return data.breakdown;
};

// ========================================================
// 4. ADMIN DYNAMIC GST CONFIGURATION
// ========================================================

export const getGstConfigAdminApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/gst`, {
      headers: getAdminHeaders()
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data.success) {
        return {
          config: data.config || FALLBACK_GST,
          changeHistory: data.changeHistory || []
        };
      }
    }
  } catch (e) {
    console.warn('Backend GST admin pending deployment on Render, using default:', e.message);
  }
  return {
    config: FALLBACK_GST,
    changeHistory: [],
    isPendingDeployment: true
  };
};

export const updateGstConfigAdminApi = async (gstData) => {
  const response = await fetch(`${API_BASE_URL}/admin/gst`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(gstData)
  });
  return await handleResponse(response, 'Failed to save GST configuration');
};

// ========================================================
// 5. ADMIN AUDIT LOGS
// ========================================================

export const getAuditLogsApi = async (limit = 100) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/audit-logs?limit=${limit}`, {
      headers: getAdminHeaders()
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return data.logs || [];
    }
  } catch (e) {
    console.warn('Backend audit logs endpoint pending on Render:', e.message);
  }
  return [];
};

// ========================================================
// 6. RAZORPAY PAYMENT INTEGRATION
// ========================================================

export const createRazorpayOrderApi = async ({ planId, serviceId, serviceTitle, region, clientDetails }) => {
  const response = await fetch(`${API_BASE_URL}/razorpay/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId,
      serviceId,
      serviceTitle,
      region: region || 'india',
      clientDetails
    })
  });

  return await handleResponse(response, 'Failed to create Razorpay order');
};

export const verifyRazorpayPaymentApi = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  paymentMethod,
  planId,
  serviceId,
  serviceTitle,
  region,
  clientDetails
}) => {
  const response = await fetch(`${API_BASE_URL}/razorpay/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod,
      planId,
      serviceId,
      serviceTitle,
      region,
      clientDetails
    })
  });

  return await handleResponse(response, 'Failed to verify Razorpay payment');
};

// ========================================================
// 7. DIRECT UPI (GPay / PhonePe / Paytm / BHIM)
// ========================================================

export const verifyDirectUpiPaymentApi = async ({
  utr,
  upiApp,
  planId,
  serviceId,
  serviceTitle,
  region,
  clientDetails
}) => {
  const response = await fetch(`${API_BASE_URL}/upi/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      utr,
      upiApp,
      planId,
      serviceId,
      serviceTitle,
      region,
      clientDetails
    })
  });

  return await handleResponse(response, 'Failed to verify UPI payment');
};

// ========================================================
// 8. BOOKING RECEIPT & ADMIN MANAGEMENT
// ========================================================

export const getBookingByIdApi = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
  const data = await handleResponse(response, 'Booking receipt not found');
  return data.booking || data;
};

export const listBookingsApi = async () => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    headers: getAdminHeaders()
  });
  const data = await handleResponse(response, 'Failed to fetch bookings list');
  return data.bookings || [];
};

export const deleteBookingApi = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  return await handleResponse(response, 'Failed to delete booking');
};

export const createManualBookingApi = async ({ planId, serviceId, serviceTitle, region, amount, currency, clientDetails }) => {
  const response = await fetch(`${API_BASE_URL}/bookings/manual`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify({
      planId,
      serviceId,
      serviceTitle,
      region,
      amount,
      currency,
      clientDetails
    })
  });

  return await handleResponse(response, 'Failed to create manual booking');
};

// ========================================================
// 9. SERVICE-SPECIFIC WHATSAPP GROUP LINKS
// ========================================================

export const listServiceConfigsApi = async () => {
  const response = await fetch(`${API_BASE_URL}/services/whatsapp-links`);
  const data = await handleResponse(response, 'Failed to fetch service WhatsApp configurations');
  return data.configs || [];
};

export const updateServiceConfigApi = async (serviceId, { whatsappGroupLink, whatsappChannelName, serviceTitle }) => {
  const response = await fetch(`${API_BASE_URL}/services/whatsapp-links/${serviceId}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify({
      whatsappGroupLink,
      whatsappChannelName,
      serviceTitle
    })
  });

  return await handleResponse(response, 'Failed to update service WhatsApp configuration');
};

export const resetServiceConfigApi = async (serviceId) => {
  const response = await fetch(`${API_BASE_URL}/services/whatsapp-links/${serviceId}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });

  return await handleResponse(response, 'Failed to reset service configuration');
};
