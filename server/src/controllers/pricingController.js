import {
  getAllPricingPlansFromStore,
  getPricingPlanByIdFromStore,
  savePricingPlanToStore,
  deletePricingPlanFromStore,
  reorderPricingPlansInStore,
  getGstConfigFromStore
} from '../db/store.js';
import { calculatePricingBreakdown, round2 } from '../utils/pricingEngine.js';

/**
 * 1. Public: Get all active published pricing plans with dynamic GST calculations
 */
export const getPublishedPricing = async (req, res) => {
  try {
    const activePlans = await getAllPricingPlansFromStore(true);
    const gstConfig = await getGstConfigFromStore();

    const enrichedPlans = activePlans.map((plan) => {
      const indiaCalc = calculatePricingBreakdown(plan, gstConfig, 'india');
      const internationalCalc = calculatePricingBreakdown(plan, gstConfig, 'international');

      return {
        ...plan,
        calculations: {
          india: indiaCalc,
          international: internationalCalc
        }
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedPlans.length,
      gstConfig: {
        gstEnabled: gstConfig.gstEnabled,
        defaultRate: gstConfig.defaultRate,
        isInclusive: gstConfig.isInclusive,
        hsnSacCode: gstConfig.hsnSacCode,
        taxName: gstConfig.taxName
      },
      plans: enrichedPlans
    });
  } catch (err) {
    console.error('Error fetching published pricing:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve pricing directory'
    });
  }
};

/**
 * 2. Public: Get single pricing plan by planId or serviceId with calculations
 */
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await getPricingPlanByIdFromStore(id);

    if (!plan || plan.isActive === false) {
      return res.status(404).json({
        success: false,
        error: `No active pricing plan found for identifier: ${id}`
      });
    }

    const gstConfig = await getGstConfigFromStore();
    const indiaCalc = calculatePricingBreakdown(plan, gstConfig, 'india');
    const internationalCalc = calculatePricingBreakdown(plan, gstConfig, 'international');

    return res.status(200).json({
      success: true,
      plan: {
        ...plan,
        calculations: {
          india: indiaCalc,
          international: internationalCalc
        }
      }
    });
  } catch (err) {
    console.error(`Error fetching plan ${req.params.id}:`, err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch plan details'
    });
  }
};

/**
 * 3. Admin: List all pricing plans (active and inactive)
 */
export const listAllPricingAdmin = async (req, res) => {
  try {
    const plans = await getAllPricingPlansFromStore(false);
    const gstConfig = await getGstConfigFromStore();

    const enrichedPlans = plans.map((plan) => ({
      ...plan,
      calculations: {
        india: calculatePricingBreakdown(plan, gstConfig, 'india'),
        international: calculatePricingBreakdown(plan, gstConfig, 'international')
      }
    }));

    return res.status(200).json({
      success: true,
      count: enrichedPlans.length,
      gstConfig,
      plans: enrichedPlans
    });
  } catch (err) {
    console.error('Admin list pricing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve admin pricing list'
    });
  }
};

/**
 * 4. Admin: Create a new pricing plan
 */
export const createPricingPlan = async (req, res) => {
  try {
    const {
      serviceId,
      name,
      subtitle,
      description,
      pricingType = 'one-time',
      billingInterval = null,
      priceIndia,
      originalPriceIndia,
      priceInternational,
      originalPriceInternational,
      features = [],
      deliverables = [],
      badge = 'Advisory Plan',
      isActive = true,
      applicableGstRate = null
    } = req.body;

    if (!serviceId || !name || priceIndia === undefined || priceInternational === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: serviceId, name, priceIndia, and priceInternational are mandatory.'
      });
    }

    const sanitizedServiceId = serviceId.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    const planId = `plan_${sanitizedServiceId}_${Date.now().toString(36)}`;

    const currentPlans = await getAllPricingPlansFromStore(false);
    const nextSortOrder = currentPlans.length > 0 ? Math.max(...currentPlans.map((p) => p.sortOrder || 0)) + 1 : 1;

    const planData = {
      planId,
      serviceId: sanitizedServiceId,
      name: name.trim(),
      subtitle: (subtitle || '').trim(),
      description: (description || '').trim(),
      pricingType,
      billingInterval,
      priceIndia: round2(priceIndia),
      originalPriceIndia: originalPriceIndia ? round2(originalPriceIndia) : null,
      priceInternational: round2(priceInternational),
      originalPriceInternational: originalPriceInternational ? round2(originalPriceInternational) : null,
      features: Array.isArray(features) ? features : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      badge: (badge || '').trim(),
      isActive: Boolean(isActive),
      sortOrder: nextSortOrder,
      applicableGstRate: applicableGstRate !== null && applicableGstRate !== undefined ? Number(applicableGstRate) : null
    };

    const created = await savePricingPlanToStore(planData, req.admin?.user || 'Admin');

    return res.status(201).json({
      success: true,
      message: 'Pricing plan created successfully',
      plan: created
    });
  } catch (err) {
    console.error('Create pricing plan error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create pricing plan: ' + err.message
    });
  }
};

/**
 * 5. Admin: Update an existing pricing plan
 */
export const updatePricingPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const existing = await getPricingPlanByIdFromStore(planId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Pricing plan with ID ${planId} does not exist.`
      });
    }

    const updateFields = { ...req.body };
    delete updateFields.planId; // Protect primary planId key

    if (updateFields.priceIndia !== undefined) {
      updateFields.priceIndia = round2(updateFields.priceIndia);
    }
    if (updateFields.originalPriceIndia !== undefined) {
      updateFields.originalPriceIndia = updateFields.originalPriceIndia ? round2(updateFields.originalPriceIndia) : null;
    }
    if (updateFields.priceInternational !== undefined) {
      updateFields.priceInternational = round2(updateFields.priceInternational);
    }
    if (updateFields.originalPriceInternational !== undefined) {
      updateFields.originalPriceInternational = updateFields.originalPriceInternational ? round2(updateFields.originalPriceInternational) : null;
    }

    const updated = await savePricingPlanToStore({
      ...existing,
      ...updateFields,
      planId
    }, req.admin?.user || 'Admin');

    return res.status(200).json({
      success: true,
      message: 'Pricing plan updated successfully',
      plan: updated
    });
  } catch (err) {
    console.error(`Update pricing plan ${req.params.planId} error:`, err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update pricing plan'
    });
  }
};

/**
 * 6. Admin: Toggle Plan Active / Inactive Status
 */
export const togglePlanStatus = async (req, res) => {
  try {
    const { planId } = req.params;
    const { isActive } = req.body;

    const existing = await getPricingPlanByIdFromStore(planId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Pricing plan ${planId} not found`
      });
    }

    const updated = await savePricingPlanToStore({
      ...existing,
      isActive: Boolean(isActive),
      planId
    }, req.admin?.user || 'Admin');

    return res.status(200).json({
      success: true,
      message: `Plan ${planId} is now ${updated.isActive ? 'Active' : 'Deactivated'}`,
      plan: updated
    });
  } catch (err) {
    console.error('Toggle plan status error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update plan status'
    });
  }
};

/**
 * 7. Admin: Reorder Pricing Plans
 */
export const reorderPricingPlans = async (req, res) => {
  try {
    const { orderedPlanIds } = req.body;

    if (!Array.isArray(orderedPlanIds) || orderedPlanIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'orderedPlanIds must be a non-empty array of planId strings'
      });
    }

    const reordered = await reorderPricingPlansInStore(orderedPlanIds, req.admin?.user || 'Admin');

    return res.status(200).json({
      success: true,
      message: 'Pricing plans reordered successfully',
      plans: reordered
    });
  } catch (err) {
    console.error('Reorder plans error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to reorder pricing plans'
    });
  }
};

/**
 * 8. Admin: Delete / Archive a pricing plan
 */
export const deletePricingPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const existing = await getPricingPlanByIdFromStore(planId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Pricing plan ${planId} not found`
      });
    }

    await deletePricingPlanFromStore(planId, req.admin?.user || 'Admin');

    return res.status(200).json({
      success: true,
      message: `Pricing plan ${planId} deleted successfully`
    });
  } catch (err) {
    console.error('Delete pricing plan error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete pricing plan'
    });
  }
};

/**
 * 9. Live Preview Calculation (Without saving)
 */
export const previewPricingCalculation = async (req, res) => {
  try {
    const { plan, gstConfigOverride, region = 'india' } = req.body;
    const currentGstConfig = await getGstConfigFromStore();
    const effectiveGstConfig = gstConfigOverride ? { ...currentGstConfig, ...gstConfigOverride } : currentGstConfig;

    const breakdown = calculatePricingBreakdown(plan || {}, effectiveGstConfig, region);

    return res.status(200).json({
      success: true,
      breakdown
    });
  } catch (err) {
    console.error('Preview pricing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to compute pricing preview'
    });
  }
};
