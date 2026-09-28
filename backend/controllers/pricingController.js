const pricingData = require('../data/pricingData');
const PricingTier = require('../models/PricingTier');
const mongoose = require('mongoose');

/**
 * @desc   Get all pricing tiers and studio travel policy
 * @route  GET /api/pricing
 * @access Public
 */
const getPricingTiers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbTiers = await PricingTier.find();
      if (dbTiers && dbTiers.length > 0) {
        return res.status(200).json({
          success: true,
          currency: pricingData.currency,
          tiers: dbTiers,
          travelPolicy: pricingData.travelPolicy,
          source: 'database'
        });
      }
    }

    res.status(200).json({
      success: true,
      currency: pricingData.currency,
      tiers: pricingData.tiers,
      travelPolicy: pricingData.travelPolicy,
      source: 'in-code'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricingTiers
};
