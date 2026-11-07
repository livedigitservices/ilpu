import dotenv from 'dotenv';
import { generateAdminToken } from '../middleware/auth.js';
import { getPricingAuditLogsFromStore } from '../db/store.js';

dotenv.config();

const ADMIN_PASSCODE = (process.env.ADMIN_PASSCODE || 'ilpu2026').trim();

/**
 * Admin Login Endpoint - Validates passcode and returns signed JWT/HMAC token
 */
export const adminLogin = async (req, res) => {
  try {
    const { passcode } = req.body;

    if (!passcode || typeof passcode !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Passcode is required'
      });
    }

    if (passcode.trim() !== ADMIN_PASSCODE) {
      console.warn(`⚠️ [Security Alert] Failed admin login attempt from IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator passcode. Please verify credentials.'
      });
    }

    const token = generateAdminToken('super_admin');

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      expiresInHours: 24,
      role: 'admin'
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication system failure'
    });
  }
};

/**
 * Verify current session token validity
 */
export const verifyAdminSession = async (req, res) => {
  return res.status(200).json({
    success: true,
    authenticated: true,
    admin: req.admin
  });
};

/**
 * Get pricing and GST audit logs
 */
export const getAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 200);
    const logs = await getPricingAuditLogsFromStore(limit);
    return res.status(200).json({
      success: true,
      logs
    });
  } catch (err) {
    console.error('Audit logs fetch error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve system audit logs'
    });
  }
};
