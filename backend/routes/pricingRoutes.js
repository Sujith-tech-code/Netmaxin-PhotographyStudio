const express = require('express');
const router = express.Router();
const { getPricingTiers } = require('../controllers/pricingController');

router.get('/', getPricingTiers);

module.exports = router;
