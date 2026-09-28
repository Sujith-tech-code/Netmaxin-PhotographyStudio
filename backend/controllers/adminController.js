const Booking = require('../models/Booking');
const GalleryItem = require('../models/GalleryItem');
const { getBookings, getGallery } = require('../data/inMemoryStore');
const mongoose = require('mongoose');

/**
 * @desc   Verify administrative passkey
 * @route  POST /api/admin/verify
 * @access Public
 */
const verifyPasskey = async (req, res) => {
  const { passkey } = req.body;
  const configuredPasskey = process.env.ADMIN_PASSKEY || 'aperture2026';

  if (!passkey) {
    return res.status(400).json({
      success: false,
      message: 'Passkey is required.'
    });
  }

  if (passkey === configuredPasskey) {
    return res.status(200).json({
      success: true,
      message: 'Passkey verified. Welcome to the Studio Ledger.',
      data: {
        role: 'admin',
        studio: 'Aperture & Ash',
        databaseState: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Incorrect passkey. Access to studio ledger denied.'
  });
};

/**
 * @desc   Get aggregated studio ledger statistics
 * @route  GET /api/admin/stats
 * @access Protected (Admin Passkey)
 */
const getAdminStats = async (req, res, next) => {
  try {
    let bookings = [];
    let galleryCount = 0;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      bookings = await Booking.find();
      galleryCount = await GalleryItem.countDocuments();
    } else {
      bookings = getBookings();
      galleryCount = getGallery().length;
    }

    const total = bookings.length;
    const inquiry = bookings.filter(b => b.status === 'inquiry').length;
    const contacted = bookings.filter(b => b.status === 'contacted').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const archived = bookings.filter(b => b.status === 'archived').length;

    // Estimate sitting revenue value based on tiers
    const priceMap = {
      portrait: 5500,
      wedding: 65000,
      commercial: 4500, // baseline estimate
      'still-life': 4000,
      editorial: 8000,
      other: 3000
    };

    const confirmedRevenue = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + (priceMap[b.sessionType?.toLowerCase()] || 5000), 0);

    const pipelineRevenue = bookings
      .filter(b => b.status === 'inquiry' || b.status === 'contacted')
      .reduce((sum, b) => sum + (priceMap[b.sessionType?.toLowerCase()] || 5000), 0);

    res.status(200).json({
      success: true,
      data: {
        totalBookings: total,
        inquiryCount: inquiry,
        contactedCount: contacted,
        confirmedCount: confirmed,
        completedCount: completed,
        archivedCount: archived,
        galleryCount,
        confirmedRevenue,
        pipelineRevenue,
        databaseState: isDbConnected ? 'connected' : 'in-memory',
        monthlySittingCap: 6
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyPasskey,
  getAdminStats
};
