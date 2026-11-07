import { getGstConfigFromStore, updateGstConfigInStore, getPricingAuditLogsFromStore } from '../db/store.js';
import { round2 } from '../utils/pricingEngine.js';

/**
 * 1. Public: Get current public GST configuration
 */
export const getPublicGstConfig = async (req, res) => {
  try {
    const config = await getGstConfigFromStore();
    return res.status(200).json({
      success: true,
      gstConfig: {
        gstEnabled: Boolean(config.gstEnabled),
        defaultRate: Number(config.defaultRate),
        isInclusive: Boolean(config.isInclusive),
        hsnSacCode: config.hsnSacCode || '998211',
        taxName: config.taxName || 'GST',
        description: config.description || 'Goods and Services Tax'
      }
    });
  } catch (err) {
    console.error('Error fetching public GST config:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve GST settings'
    });
  }
};

/**
 * 2. Admin: Get full GST configuration including change history
 */
export const getGstConfigAdmin = async (req, res) => {
  try {
    const config = await getGstConfigFromStore();
    const allLogs = await getPricingAuditLogsFromStore(100);
    const gstLogs = allLogs.filter((log) => log.changeType === 'GST_UPDATED');

    return res.status(200).json({
      success: true,
      config,
      changeHistory: gstLogs
    });
  } catch (err) {
    console.error('Admin GST config fetch error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch GST configuration for admin'
    });
  }
};

/**
 * 3. Admin: Update GST configuration
 */
export const updateGstConfig = async (req, res) => {
  try {
    const { gstEnabled, defaultRate, isInclusive, hsnSacCode, taxName, description } = req.body;

    const updates = {};

    if (gstEnabled !== undefined) {
      updates.gstEnabled = Boolean(gstEnabled);
    }

    if (defaultRate !== undefined) {
      const parsedRate = Number(defaultRate);
      if (isNaN(parsedRate) || parsedRate < 0 || parsedRate > 100) {
        return res.status(400).json({
          success: false,
          error: 'Default GST rate must be a valid percentage between 0 and 100'
        });
      }
      updates.defaultRate = round2(parsedRate);
    }

    if (isInclusive !== undefined) {
      updates.isInclusive = Boolean(isInclusive);
    }

    if (hsnSacCode !== undefined) {
      updates.hsnSacCode = String(hsnSacCode).trim();
    }

    if (taxName !== undefined) {
      updates.taxName = String(taxName).trim();
    }

    if (description !== undefined) {
      updates.description = String(description).trim();
    }

    const updated = await updateGstConfigInStore(updates, req.admin?.user || 'Admin');

    return res.status(200).json({
      success: true,
      message: 'GST configuration updated successfully',
      config: updated
    });
  } catch (err) {
    console.error('Update GST config error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update GST configuration: ' + err.message
    });
  }
};
