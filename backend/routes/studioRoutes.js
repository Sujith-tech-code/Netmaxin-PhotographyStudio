const express = require('express');
const router = express.Router();
const { getStudioInfo } = require('../controllers/studioController');

router.get('/', getStudioInfo);

module.exports = router;
