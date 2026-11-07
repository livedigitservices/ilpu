import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Booking } from '../models/Booking.js';
import { ServiceConfig } from '../models/ServiceConfig.js';
import { PricingPlan } from '../models/PricingPlan.js';
import { GstConfig } from '../models/GstConfig.js';
import { PricingAuditLog } from '../models/PricingAuditLog.js';
import { isMongoDBConnected } from './connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../../data/bookings.json');
const serviceConfigsFilePath = path.join(__dirname, '../../data/services_whatsapp.json');
const pricingPlansFilePath = path.join(__dirname, '../../data/pricing_plans.json');
const gstConfigFilePath = path.join(__dirname, '../../data/gst_config.json');
const auditLogsFilePath = path.join(__dirname, '../../data/pricing_audit.json');

// Default initial service WhatsApp group links map
const DEFAULT_SERVICE_WHATSAPP_LINKS = {
  'international-law-business': {
    serviceId: 'international-law-business',
    serviceTitle: 'International Law & Global Business',
    whatsappGroupLink: 'https://chat.whatsapp.com/ILPU-Global-Business-Group',
    whatsappChannelName: 'ILPU Global Business Channel'
  },
  'nri-property-protection': {
    serviceId: 'nri-property-protection',
    serviceTitle: 'NRI Property Protection & Legal Solutions',
    whatsappGroupLink: 'https://chat.whatsapp.com/ILPU-NRI-Property-Group',
    whatsappChannelName: 'ILPU NRI Property Protection Group'
  },
  'contract-drafting': {
    serviceId: 'contract-drafting',
    serviceTitle: 'International Contract Drafting & Frameworks',
    whatsappGroupLink: 'https://chat.whatsapp.com/ILPU-Contract-Drafting-Group',
    whatsappChannelName: 'ILPU International Contracts Group'
  },
  'investment-opportunities': {
    serviceId: 'investment-opportunities',
    serviceTitle: 'International Investment & Wealth Protection',
    whatsappGroupLink: 'https://chat.whatsapp.com/ILPU-Investment-Wealth-Group',
    whatsappChannelName: 'ILPU Wealth & Investment Advisory Group'
  },
  'immigration-roadmap': {
    serviceId: 'immigration-roadmap',
    serviceTitle: 'Immigration & Emigration Roadmap Advisory',
    whatsappGroupLink: 'https://chat.whatsapp.com/ILPU-Immigration-Roadmap-Group',
    whatsappChannelName: 'ILPU Global Mobility & Immigration Group'
  },
  'life-after-divorce': {
    serviceId: 'life-after-divorce',
    serviceTitle: 'Family Law & Life After Divorce Advisory',
    whatsappGroupLink: 'https://chat.whatsapp.com/ILPU-Family-Law-Divorce-Group',
    whatsappChannelName: 'ILPU Family Law & Life Advisory Group'
  },
  'general-consultation': {
    serviceId: 'general-consultation',
    serviceTitle: '1-on-1 Legal Strategy Consultation',
    whatsappGroupLink: 'https://chat.whatsapp.com/ILPU-General-Legal-Group',
    whatsappChannelName: 'ILPU General Legal Strategy Group'
  }
};

// Default initial pricing plans for all 7 services
export const DEFAULT_PRICING_PLANS = [
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
    applicableGstRate: null
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
    applicableGstRate: null
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
    applicableGstRate: null
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
    applicableGstRate: null
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
    applicableGstRate: null
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
    applicableGstRate: null
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
    applicableGstRate: null
  }
];

// Default GST configuration
export const DEFAULT_GST_CONFIG = {
  configId: 'global_gst_config',
  gstEnabled: true,
  defaultRate: 18,
  isInclusive: false, // Default is exclusive: Base + 18% GST = Total (₹499 + ₹89.82 = ₹588.82 / ₹589)
  hsnSacCode: '998211',
  taxName: 'GST',
  description: 'Goods and Services Tax (GST) applicable on legal consultancy under SAC 998211',
  updatedAt: new Date().toISOString(),
  updatedBy: 'System Default'
};

// Ensure all local backup data directories and files exist
export const ensureAllFilesExist = () => {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(serviceConfigsFilePath)) {
    fs.writeFileSync(serviceConfigsFilePath, JSON.stringify(DEFAULT_SERVICE_WHATSAPP_LINKS, null, 2));
  }
  if (!fs.existsSync(pricingPlansFilePath)) {
    fs.writeFileSync(pricingPlansFilePath, JSON.stringify(DEFAULT_PRICING_PLANS, null, 2));
  }
  if (!fs.existsSync(gstConfigFilePath)) {
    fs.writeFileSync(gstConfigFilePath, JSON.stringify(DEFAULT_GST_CONFIG, null, 2));
  }
  if (!fs.existsSync(auditLogsFilePath)) {
    fs.writeFileSync(auditLogsFilePath, JSON.stringify([], null, 2));
  }
};

// Sync save to JSON backup file
const saveToLocalFile = (bookingData) => {
  ensureAllFilesExist();
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    const bookings = JSON.parse(raw);
    const existingIndex = bookings.findIndex((b) => b.bookingId === bookingData.bookingId || b.id === bookingData.id);
    if (existingIndex >= 0) {
      bookings[existingIndex] = bookingData;
    } else {
      bookings.push(bookingData);
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(bookings, null, 2));
  } catch (err) {
    console.error('[File Backup Error]:', err.message);
  }
};

// Get all bookings from MongoDB or local file backup
export const getBookings = async () => {
  if (isMongoDBConnected()) {
    try {
      const mongoBookings = await Booking.find().sort({ createdAt: -1 }).lean();
      return mongoBookings;
    } catch (err) {
      console.error('[MongoDB getBookings Error]:', err.message);
    }
  }

  // Fallback to local JSON file
  ensureAllFilesExist();
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading bookings.json:", err);
    return [];
  }
};

// Save new booking to MongoDB and local JSON file
export const saveBooking = async (bookingData) => {
  saveToLocalFile(bookingData);

  if (isMongoDBConnected()) {
    try {
      const mongoDoc = await Booking.create(bookingData);
      console.log(`⚡ [MongoDB] Booking successfully saved to database with ID: ${mongoDoc.bookingId}`);
      return mongoDoc.toObject();
    } catch (err) {
      console.error('[MongoDB saveBooking Error]:', err.message);
    }
  }

  return bookingData;
};

// Find single booking by ID or Reference from MongoDB or local JSON file
export const findBookingById = async (id) => {
  if (isMongoDBConnected()) {
    try {
      const mongoDoc = await Booking.findOne({
        $or: [{ bookingId: id }, { id: id }, { paypalOrderId: id }, { transactionId: id }]
      }).lean();
      if (mongoDoc) return mongoDoc;
    } catch (err) {
      console.error('[MongoDB findBookingById Error]:', err.message);
    }
  }

  // Fallback to local JSON backup
  const bookings = await getBookings();
  return bookings.find((b) => b.id === id || b.bookingId === id || b.paypalOrderId === id || b.transactionId === id);
};

// Remove single booking by ID from MongoDB and local JSON file
export const removeBookingFromStore = async (id) => {
  let deletedFromMongo = false;
  if (isMongoDBConnected()) {
    try {
      const res = await Booking.deleteOne({
        $or: [{ bookingId: id }, { id: id }]
      });
      deletedFromMongo = res.deletedCount > 0;
    } catch (err) {
      console.error('[MongoDB removeBooking Error]:', err.message);
    }
  }

  ensureAllFilesExist();
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    const bookings = JSON.parse(raw);
    const filtered = bookings.filter((b) => b.bookingId !== id && b.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(filtered, null, 2));
    return true;
  } catch (err) {
    console.error('[File Delete Backup Error]:', err.message);
    return deletedFromMongo;
  }
};

// ----------------------------------------------------
// SERVICE-SPECIFIC WHATSAPP LINKS MANAGEMENT HELPERS
// ----------------------------------------------------

export const getAllServiceConfigsFromStore = async () => {
  ensureAllFilesExist();
  let localMap = { ...DEFAULT_SERVICE_WHATSAPP_LINKS };

  try {
    if (fs.existsSync(serviceConfigsFilePath)) {
      const raw = fs.readFileSync(serviceConfigsFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      localMap = { ...localMap, ...parsed };
    }
  } catch (e) {
    console.error('[Local Service Config Read Error]:', e.message);
  }

  if (isMongoDBConnected()) {
    try {
      const mongoConfigs = await ServiceConfig.find().lean();
      mongoConfigs.forEach((cfg) => {
        localMap[cfg.serviceId] = {
          serviceId: cfg.serviceId,
          serviceTitle: cfg.serviceTitle || localMap[cfg.serviceId]?.serviceTitle || cfg.serviceId,
          whatsappGroupLink: cfg.whatsappGroupLink,
          whatsappChannelName: cfg.whatsappChannelName || ''
        };
      });
    } catch (err) {
      console.error('[MongoDB getAllServiceConfigs Error]:', err.message);
    }
  }

  return Object.values(localMap);
};

export const getServiceWhatsAppLinkFromStore = async (serviceId) => {
  const configs = await getAllServiceConfigsFromStore();
  const matched = configs.find((c) => c.serviceId === serviceId);

  if (matched && matched.whatsappGroupLink) {
    return matched.whatsappGroupLink;
  }

  const defaultEntry = DEFAULT_SERVICE_WHATSAPP_LINKS[serviceId] || DEFAULT_SERVICE_WHATSAPP_LINKS['general-consultation'];
  return defaultEntry.whatsappGroupLink;
};

export const updateServiceConfigInStore = async (serviceId, updateData) => {
  ensureAllFilesExist();
  const serviceTitle = updateData.serviceTitle || DEFAULT_SERVICE_WHATSAPP_LINKS[serviceId]?.serviceTitle || serviceId;
  const whatsappGroupLink = updateData.whatsappGroupLink || DEFAULT_SERVICE_WHATSAPP_LINKS[serviceId]?.whatsappGroupLink || 'https://chat.whatsapp.com/ILPULegalAdvisoryGroup';
  const whatsappChannelName = updateData.whatsappChannelName || '';

  const payload = {
    serviceId,
    serviceTitle,
    whatsappGroupLink,
    whatsappChannelName,
    updatedAt: new Date()
  };

  try {
    let localMap = { ...DEFAULT_SERVICE_WHATSAPP_LINKS };
    if (fs.existsSync(serviceConfigsFilePath)) {
      const raw = fs.readFileSync(serviceConfigsFilePath, 'utf8');
      localMap = { ...localMap, ...JSON.parse(raw) };
    }
    localMap[serviceId] = payload;
    fs.writeFileSync(serviceConfigsFilePath, JSON.stringify(localMap, null, 2));
  } catch (e) {
    console.error('[Save Service Config Local File Error]:', e.message);
  }

  if (isMongoDBConnected()) {
    try {
      await ServiceConfig.findOneAndUpdate(
        { serviceId },
        payload,
        { upsert: true, new: true }
      );
      console.log(`⚡ [MongoDB] Service WhatsApp Config updated for ${serviceId}`);
    } catch (err) {
      console.error('[MongoDB updateServiceConfig Error]:', err.message);
    }
  }

  return payload;
};

export const deleteServiceConfigInStore = async (serviceId) => {
  ensureAllFilesExist();
  const defaultVal = DEFAULT_SERVICE_WHATSAPP_LINKS[serviceId];
  if (isMongoDBConnected()) {
    try {
      await ServiceConfig.deleteOne({ serviceId });
    } catch (e) {
      console.error('[MongoDB deleteServiceConfig Error]:', e.message);
    }
  }

  try {
    if (fs.existsSync(serviceConfigsFilePath)) {
      const raw = fs.readFileSync(serviceConfigsFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      delete parsed[serviceId];
      fs.writeFileSync(serviceConfigsFilePath, JSON.stringify(parsed, null, 2));
    }
  } catch (e) {
    console.error('[Local Service Config Delete Error]:', e.message);
  }

  return defaultVal || { serviceId, reset: true };
};

// ----------------------------------------------------
// DYNAMIC PRICING PLANS STORE HELPERS
// ----------------------------------------------------

export const getAllPricingPlansFromStore = async (onlyActive = false) => {
  ensureAllFilesExist();

  let plans = [...DEFAULT_PRICING_PLANS];

  // Try reading local file
  try {
    if (fs.existsSync(pricingPlansFilePath)) {
      const raw = fs.readFileSync(pricingPlansFilePath, 'utf8');
      const filePlans = JSON.parse(raw);
      if (Array.isArray(filePlans) && filePlans.length > 0) {
        plans = filePlans;
      }
    }
  } catch (e) {
    console.error('[Local Pricing Plans Read Error]:', e.message);
  }

  // If MongoDB connected, sync/fetch from MongoDB
  if (isMongoDBConnected()) {
    try {
      const count = await PricingPlan.countDocuments();
      if (count === 0) {
        // Seed default plans to MongoDB
        await PricingPlan.insertMany(plans);
        console.log('⚡ [MongoDB] Seeded default pricing plans to database');
      } else {
        const mongoPlans = await PricingPlan.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
        if (mongoPlans && mongoPlans.length > 0) {
          plans = mongoPlans;
        }
      }
    } catch (err) {
      console.error('[MongoDB getAllPricingPlans Error]:', err.message);
    }
  }

  // Sort by sortOrder
  plans.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (onlyActive) {
    return plans.filter((p) => p.isActive !== false);
  }

  return plans;
};

export const getPricingPlanByIdFromStore = async (idOrServiceId) => {
  const plans = await getAllPricingPlansFromStore(false);
  const matched = plans.find((p) => p.planId === idOrServiceId || p.serviceId === idOrServiceId);
  return matched || null;
};

export const savePricingPlanToStore = async (planData, changedBy = 'Admin') => {
  ensureAllFilesExist();
  const planId = planData.planId || `plan_${planData.serviceId || Date.now()}`;
  const completePlan = {
    ...planData,
    planId,
    updatedAt: new Date()
  };

  const currentPlans = await getAllPricingPlansFromStore(false);
  const existingIdx = currentPlans.findIndex((p) => p.planId === planId);
  const previousValue = existingIdx >= 0 ? currentPlans[existingIdx] : null;

  if (existingIdx >= 0) {
    currentPlans[existingIdx] = { ...currentPlans[existingIdx], ...completePlan };
  } else {
    currentPlans.push(completePlan);
  }

  // Write to local JSON file
  try {
    fs.writeFileSync(pricingPlansFilePath, JSON.stringify(currentPlans, null, 2));
  } catch (e) {
    console.error('[Save Pricing Plan Local File Error]:', e.message);
  }

  // Save to MongoDB
  if (isMongoDBConnected()) {
    try {
      await PricingPlan.findOneAndUpdate(
        { planId },
        completePlan,
        { upsert: true, new: true }
      );
      console.log(`⚡ [MongoDB] Pricing plan saved: ${planId}`);
    } catch (err) {
      console.error('[MongoDB savePricingPlan Error]:', err.message);
    }
  }

  // Audit log
  await addPricingAuditLog({
    changeType: previousValue ? 'PLAN_UPDATED' : 'PLAN_CREATED',
    entityId: planId,
    entityName: completePlan.name || planId,
    previousValue,
    newValue: completePlan,
    changedBy,
    changeSummary: previousValue
      ? `Updated plan ${completePlan.name || planId} (India: ₹${completePlan.priceIndia}, Int: $${completePlan.priceInternational})`
      : `Created new plan ${completePlan.name || planId} (India: ₹${completePlan.priceIndia}, Int: $${completePlan.priceInternational})`
  });

  return completePlan;
};

export const deletePricingPlanFromStore = async (planId, changedBy = 'Admin') => {
  ensureAllFilesExist();
  const currentPlans = await getAllPricingPlansFromStore(false);
  const targetPlan = currentPlans.find((p) => p.planId === planId);
  const filtered = currentPlans.filter((p) => p.planId !== planId);

  try {
    fs.writeFileSync(pricingPlansFilePath, JSON.stringify(filtered, null, 2));
  } catch (e) {
    console.error('[Delete Pricing Plan Local File Error]:', e.message);
  }

  if (isMongoDBConnected()) {
    try {
      await PricingPlan.deleteOne({ planId });
    } catch (err) {
      console.error('[MongoDB deletePricingPlan Error]:', err.message);
    }
  }

  if (targetPlan) {
    await addPricingAuditLog({
      changeType: 'PLAN_DELETED',
      entityId: planId,
      entityName: targetPlan.name || planId,
      previousValue: targetPlan,
      newValue: null,
      changedBy,
      changeSummary: `Deleted pricing plan: ${targetPlan.name || planId}`
    });
  }

  return true;
};

export const reorderPricingPlansInStore = async (orderedPlanIds, changedBy = 'Admin') => {
  ensureAllFilesExist();
  const currentPlans = await getAllPricingPlansFromStore(false);

  orderedPlanIds.forEach((id, index) => {
    const plan = currentPlans.find((p) => p.planId === id);
    if (plan) {
      plan.sortOrder = index + 1;
      plan.updatedAt = new Date();
    }
  });

  currentPlans.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  try {
    fs.writeFileSync(pricingPlansFilePath, JSON.stringify(currentPlans, null, 2));
  } catch (e) {
    console.error('[Reorder Pricing Plans Local File Error]:', e.message);
  }

  if (isMongoDBConnected()) {
    try {
      const ops = orderedPlanIds.map((id, index) => ({
        updateOne: {
          filter: { planId: id },
          update: { $set: { sortOrder: index + 1, updatedAt: new Date() } }
        }
      }));
      await PricingPlan.bulkWrite(ops);
    } catch (err) {
      console.error('[MongoDB reorderPricingPlans Error]:', err.message);
    }
  }

  await addPricingAuditLog({
    changeType: 'PLANS_REORDERED',
    entityId: 'pricing_plans_list',
    entityName: 'All Plans',
    previousValue: null,
    newValue: orderedPlanIds,
    changedBy,
    changeSummary: `Reordered ${orderedPlanIds.length} pricing plans`
  });

  return currentPlans;
};

// ----------------------------------------------------
// DYNAMIC GST CONFIG STORE HELPERS
// ----------------------------------------------------

export const getGstConfigFromStore = async () => {
  ensureAllFilesExist();
  let config = { ...DEFAULT_GST_CONFIG };

  try {
    if (fs.existsSync(gstConfigFilePath)) {
      const raw = fs.readFileSync(gstConfigFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.defaultRate === 'number') {
        config = { ...config, ...parsed };
      }
    }
  } catch (e) {
    console.error('[Local GST Config Read Error]:', e.message);
  }

  if (isMongoDBConnected()) {
    try {
      const mongoConfig = await GstConfig.findOne({ configId: 'global_gst_config' }).lean();
      if (mongoConfig) {
        config = { ...config, ...mongoConfig };
      } else {
        await GstConfig.create(config);
      }
    } catch (err) {
      console.error('[MongoDB getGstConfig Error]:', err.message);
    }
  }

  return config;
};

export const updateGstConfigInStore = async (gstData, changedBy = 'Admin') => {
  ensureAllFilesExist();
  const current = await getGstConfigFromStore();

  const updated = {
    ...current,
    ...gstData,
    configId: 'global_gst_config',
    updatedAt: new Date().toISOString(),
    updatedBy: changedBy
  };

  try {
    fs.writeFileSync(gstConfigFilePath, JSON.stringify(updated, null, 2));
  } catch (e) {
    console.error('[Save GST Config Local File Error]:', e.message);
  }

  if (isMongoDBConnected()) {
    try {
      await GstConfig.findOneAndUpdate(
        { configId: 'global_gst_config' },
        updated,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('[MongoDB updateGstConfig Error]:', err.message);
    }
  }

  await addPricingAuditLog({
    changeType: 'GST_UPDATED',
    entityId: 'global_gst_config',
    entityName: 'Global GST Configuration',
    previousValue: current,
    newValue: updated,
    changedBy,
    changeSummary: `Updated GST: Enabled=${updated.gstEnabled}, Rate=${updated.defaultRate}%, Inclusive=${updated.isInclusive}`
  });

  return updated;
};

// ----------------------------------------------------
// PRICING & GST AUDIT LOGS
// ----------------------------------------------------

export const addPricingAuditLog = async (logData) => {
  ensureAllFilesExist();
  const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    auditId,
    timestamp: new Date().toISOString(),
    ...logData
  };

  try {
    let logs = [];
    if (fs.existsSync(auditLogsFilePath)) {
      const raw = fs.readFileSync(auditLogsFilePath, 'utf8');
      logs = JSON.parse(raw);
    }
    logs.unshift(record);
    // Keep max 500 audit records locally
    if (logs.length > 500) logs = logs.slice(0, 500);
    fs.writeFileSync(auditLogsFilePath, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error('[Audit Log File Error]:', e.message);
  }

  if (isMongoDBConnected()) {
    try {
      await PricingAuditLog.create(record);
    } catch (err) {
      console.error('[MongoDB addPricingAuditLog Error]:', err.message);
    }
  }

  return record;
};

export const getPricingAuditLogsFromStore = async (limit = 100) => {
  if (isMongoDBConnected()) {
    try {
      const mongoLogs = await PricingAuditLog.find().sort({ timestamp: -1 }).limit(limit).lean();
      if (mongoLogs && mongoLogs.length > 0) return mongoLogs;
    } catch (err) {
      console.error('[MongoDB getPricingAuditLogs Error]:', err.message);
    }
  }

  ensureAllFilesExist();
  try {
    if (fs.existsSync(auditLogsFilePath)) {
      const raw = fs.readFileSync(auditLogsFilePath, 'utf8');
      const logs = JSON.parse(raw);
      return logs.slice(0, limit);
    }
  } catch (e) {
    console.error('[Audit Log Read Error]:', e.message);
  }

  return [];
};
