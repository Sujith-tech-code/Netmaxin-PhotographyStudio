const mongoose = require('mongoose');

const pricingTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  priceFormatted: {
    type: String,
    required: true
  },
  period: String,
  featured: {
    type: Boolean,
    default: false
  },
  tagline: String,
  duration: String,
  inclusions: [String],
  turnaround: String,
  badge: String
});

module.exports = mongoose.model('PricingTier', pricingTierSchema);
