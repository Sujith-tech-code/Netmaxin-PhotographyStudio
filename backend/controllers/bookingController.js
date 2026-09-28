const Booking = require('../models/Booking');
const { getBookings, addBooking, updateBookingStatus: updateMemBooking, deleteBooking: deleteMemBooking } = require('../data/inMemoryStore');
const mongoose = require('mongoose');

/**
 * @desc   Create a new booking / inquiry
 * @route  POST /api/bookings
 * @access Public
 */
const createBooking = async (req, res, next) => {
  try {
    const { clientName, clientEmail, sessionType, preferredDate, message } = req.body;

    let savedBooking;

    // Persist to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      savedBooking = await Booking.create({
        clientName,
        clientEmail,
        sessionType,
        preferredDate: preferredDate || 'Flexible / To be discussed',
        message
      });
    } else {
      // Fallback to in-memory store
      savedBooking = addBooking({
        clientName,
        clientEmail,
        sessionType,
        preferredDate: preferredDate || 'Flexible / To be discussed',
        message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Your sitting inquiry has been warmly received in our studio ledger. We will reach out within 24 hours.',
      data: savedBooking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all booking inquiries (Studio administrative ledger)
 * @route  GET /api/bookings
 * @access Protected (Admin Passkey)
 */
const getBookingsList = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
        source: 'database'
      });
    }

    const inMemoryList = getBookings();
    res.status(200).json({
      success: true,
      count: inMemoryList.length,
      data: inMemoryList,
      source: 'in-code'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update booking inquiry status (e.g., inquiry -> contacted -> confirmed -> completed -> archived)
 * @route  PATCH /api/bookings/:id/status
 * @access Protected (Admin Passkey)
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['inquiry', 'contacted', 'confirmed', 'completed', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Choose from: ${validStatuses.join(', ')}`
      });
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found in database ledger.'
        });
      }

      return res.status(200).json({
        success: true,
        message: `Booking status updated to '${status}'.`,
        data: updated
      });
    }

    // In-memory fallback
    const updatedMem = updateMemBooking(id, status);
    if (!updatedMem) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found in studio ledger.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}'.`,
      data: updatedMem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete booking inquiry from ledger
 * @route  DELETE /api/bookings/:id
 * @access Protected (Admin Passkey)
 */
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Booking.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found in database.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Booking inquiry removed from studio ledger.'
      });
    }

    const removed = deleteMemBooking(id);
    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found in studio ledger.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking inquiry removed from studio ledger.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingsList,
  updateBookingStatus,
  deleteBooking
};
