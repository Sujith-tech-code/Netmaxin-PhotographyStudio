const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingsList,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');
const { validateBookingInput } = require('../middleware/validator');
const { adminAuth } = require('../middleware/auth');

// Public route to submit an inquiry
router.post('/', validateBookingInput, createBooking);

// Protected administrative ledger routes
router.get('/', adminAuth, getBookingsList);
router.patch('/:id/status', adminAuth, updateBookingStatus);
router.delete('/:id', adminAuth, deleteBooking);

module.exports = router;
