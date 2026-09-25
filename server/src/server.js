import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';
import { connectDB, isMongoDBConnected } from './db/connect.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize MongoDB Connection
connectDB();

// API Routes
app.use('/api', apiRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    server: 'ILPU Legal Express Backend Server',
    mongoDBConnected: isMongoDBConnected(),
    adminEmailConfigured: !!process.env.ADMIN_EMAIL,
    adminEmail: process.env.ADMIN_EMAIL || 'admin@ilpulegal.com',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`⚡ ILPU Legal Express Server running on port ${PORT}`);
  console.log(`⚡ Admin Email configured: ${process.env.ADMIN_EMAIL || 'admin@ilpulegal.com'}`);
  console.log(`⚡ API URL: http://localhost:${PORT}/api`);
  console.log(`=================================================`);
});
