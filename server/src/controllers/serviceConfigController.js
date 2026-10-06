import {
  getAllServiceConfigsFromStore,
  getServiceWhatsAppLinkFromStore,
  updateServiceConfigInStore,
  deleteServiceConfigInStore
} from '../db/store.js';

/**
 * 1. List all Service WhatsApp Configs
 */
export const listServiceConfigs = async (req, res) => {
  try {
    const configs = await getAllServiceConfigsFromStore();
    return res.status(200).json({ success: true, configs });
  } catch (err) {
    console.error('[List Service Configs Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch service WhatsApp configurations' });
  }
};

/**
 * 2. Get Single Service WhatsApp Link by Service ID
 */
export const getServiceConfig = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const whatsappGroupLink = await getServiceWhatsAppLinkFromStore(serviceId);
    return res.status(200).json({ success: true, serviceId, whatsappGroupLink });
  } catch (err) {
    console.error('[Get Service Config Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch service configuration' });
  }
};

/**
 * 3. Update or Create Service WhatsApp Link (Admin Endpoint)
 */
export const updateServiceConfig = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { whatsappGroupLink, whatsappChannelName, serviceTitle } = req.body;

    if (!whatsappGroupLink || !whatsappGroupLink.trim()) {
      return res.status(400).json({ success: false, error: 'WhatsApp Group/Channel URL is required' });
    }

    const updated = await updateServiceConfigInStore(serviceId, {
      whatsappGroupLink: whatsappGroupLink.trim(),
      whatsappChannelName: (whatsappChannelName || '').trim(),
      serviceTitle: (serviceTitle || '').trim()
    });

    return res.status(200).json({ success: true, config: updated });
  } catch (err) {
    console.error('[Update Service Config Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to update service WhatsApp configuration' });
  }
};

/**
 * 4. Reset/Delete Service WhatsApp Link back to default
 */
export const resetServiceConfig = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const reset = await deleteServiceConfigInStore(serviceId);
    return res.status(200).json({ success: true, message: `Service ${serviceId} reset to default`, config: reset });
  } catch (err) {
    console.error('[Reset Service Config Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset service configuration' });
  }
};
