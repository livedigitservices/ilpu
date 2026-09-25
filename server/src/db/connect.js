import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return true;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ilpu_legal';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`⚡ [MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (err) {
    console.warn(`⚠️ [MongoDB Notice] Could not connect to MongoDB at (${uri}):`, err.message);
    console.warn(`⚡ [MongoDB Fallback] Backend will safely operate using persistent JSON store & email notifications.`);
    return false;
  }
};

export const isMongoDBConnected = () => isConnected;
