const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please provide your name or organization'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  clientEmail: {
    type: String,
    required: [true, 'Please provide your email address'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  sessionType: {
    type: String,
    required: [true, 'Please select a session type'],
    enum: ['portrait', 'wedding', 'commercial', 'still-life', 'editorial', 'other'],
    default: 'portrait'
  },
  preferredDate: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please describe your project or sitting goals'],
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['inquiry', 'contacted', 'confirmed', 'completed', 'archived'],
    default: 'inquiry'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
