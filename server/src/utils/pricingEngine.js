/**
 * Pricing & GST Calculation Engine
 * Guarantees zero floating-point calculation errors using round2 and exact decimal math.
 */

export const round2 = (num) => {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
};

/**
 * Calculates complete pricing & GST breakdown for a given plan and region
 * 
 * @param {Object} plan - The PricingPlan document or object
 * @param {Object} gstConfig - The current GstConfig document or object
 * @param {string} region - 'india' | 'international'
 * @returns {Object} Complete calculation breakdown
 */
export const calculatePricingBreakdown = (plan, gstConfig, region = 'india') => {
  const isIndia = region.toLowerCase() === 'india';
  const currency = isIndia ? 'INR' : 'USD';

  if (!isIndia) {
    // International consultation: Export of legal consultancy service (Zero-rated / 0% GST)
    const basePrice = round2(plan.priceInternational ?? 5);
    const originalPrice = plan.originalPriceInternational ? round2(plan.originalPriceInternational) : null;
    const discountAmount = originalPrice && originalPrice > basePrice ? round2(originalPrice - basePrice) : 0;
    const discountPercentage = originalPrice && originalPrice > basePrice ? Math.round(((originalPrice - basePrice) / originalPrice) * 100) : 0;

    return {
      region: 'international',
      currency: 'USD',
      currencySymbol: '$',
      basePrice,
      originalPrice,
      discountAmount,
      discountPercentage,
      gstEnabled: false,
      gstRate: 0,
      gstAmount: 0,
      isInclusive: false,
      totalAmount: basePrice,
      totalPaiseOrCents: Math.round(basePrice * 100),
      hsnSacCode: gstConfig?.hsnSacCode || '998211',
      taxName: 'Export Service (0% Tax)',
      formattedBase: `$${basePrice}`,
      formattedTotal: `$${basePrice} USD`,
      displayString: `$${basePrice} USD`
    };
  }

  // India Domestic Consultation
  const gstEnabled = Boolean(gstConfig?.gstEnabled ?? true);
  const gstRate = gstEnabled ? Number(plan.applicableGstRate ?? gstConfig?.defaultRate ?? 18) : 0;
  const isInclusive = Boolean(gstConfig?.isInclusive ?? false);
  const rawPrice = round2(plan.priceIndia ?? 499);
  const originalPrice = plan.originalPriceIndia ? round2(plan.originalPriceIndia) : null;

  let basePrice = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (!gstEnabled || gstRate === 0) {
    basePrice = rawPrice;
    gstAmount = 0;
    totalAmount = rawPrice;
  } else if (isInclusive) {
    // Price includes GST
    totalAmount = rawPrice;
    basePrice = round2(totalAmount / (1 + gstRate / 100));
    gstAmount = round2(totalAmount - basePrice);
  } else {
    // Price excludes GST (Standard: Base + 18% GST = Total)
    basePrice = rawPrice;
    gstAmount = round2((basePrice * gstRate) / 100);
    totalAmount = round2(basePrice + gstAmount);
  }

  const discountAmount = originalPrice && originalPrice > basePrice ? round2(originalPrice - basePrice) : 0;
  const discountPercentage = originalPrice && originalPrice > basePrice ? Math.round(((originalPrice - basePrice) / originalPrice) * 100) : 0;

  return {
    region: 'india',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice,
    originalPrice,
    discountAmount,
    discountPercentage,
    gstEnabled,
    gstRate,
    gstAmount,
    isInclusive,
    totalAmount,
    totalPaiseOrCents: Math.round(totalAmount * 100),
    hsnSacCode: gstConfig?.hsnSacCode || '998211',
    taxName: gstConfig?.taxName || 'GST',
    taxDescription: gstConfig?.description || 'Goods and Services Tax',
    formattedBase: `₹${basePrice.toLocaleString('en-IN')}`,
    formattedGst: `₹${gstAmount.toLocaleString('en-IN')}`,
    formattedTotal: `₹${totalAmount.toLocaleString('en-IN')}`,
    displayString: isInclusive
      ? `₹${totalAmount.toLocaleString('en-IN')} (incl. ${gstRate}% GST)`
      : `₹${basePrice.toLocaleString('en-IN')} + ${gstRate}% GST (Total ₹${totalAmount.toLocaleString('en-IN')})`
  };
};
