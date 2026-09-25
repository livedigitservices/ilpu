import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Booking } from '../models/Booking.js';
import { isMongoDBConnected } from './connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../../data/bookings.json');

// Ensure local backup data directory and file exist
const ensureFileExists = () => {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
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
