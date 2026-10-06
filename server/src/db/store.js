import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Booking } from '../models/Booking.js';
import { ServiceConfig } from '../models/ServiceConfig.js';
import { isMongoDBConnected } from './connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../../data/bookings.json');
const serviceConfigsFilePath = path.join(__dirname, '../../data/services_whatsapp.json');

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

// Ensure local backup data directory and files exist
const ensureFileExists = () => {
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
};

// Sync save to JSON backup file
const saveToLocalFile = (bookingData) => {
  ensureFileExists();
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
  ensureFileExists();
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
  // Always update local JSON file as backup
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
        $or: [{ bookingId: id }, { id: id }, { paypalOrderId: id }]
      }).lean();
      if (mongoDoc) return mongoDoc;
    } catch (err) {
      console.error('[MongoDB findBookingById Error]:', err.message);
    }
  }

  // Fallback to local JSON backup
  const bookings = await getBookings();
  return bookings.find((b) => b.id === id || b.bookingId === id || b.paypalOrderId === id);
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

  ensureFileExists();
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
  ensureFileExists();
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

  // Fallback to default or general consultation group
  const defaultEntry = DEFAULT_SERVICE_WHATSAPP_LINKS[serviceId] || DEFAULT_SERVICE_WHATSAPP_LINKS['general-consultation'];
  return defaultEntry.whatsappGroupLink;
};

export const updateServiceConfigInStore = async (serviceId, updateData) => {
  ensureFileExists();
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

  // Save to local JSON backup
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

  // Save to MongoDB Atlas
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
  ensureFileExists();
  // Reset to default
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

