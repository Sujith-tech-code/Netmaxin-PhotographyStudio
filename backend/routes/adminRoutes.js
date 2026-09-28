const express = require('express');
const router = express.Router();
const { verifyPasskey, getAdminStats } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.post('/verify', verifyPasskey);
router.get('/stats', adminAuth, getAdminStats);

module.exports = router;
