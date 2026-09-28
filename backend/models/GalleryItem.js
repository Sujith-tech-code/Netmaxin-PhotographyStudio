const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  frameNumber: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Portrait', 'Wedding', 'Still Life', 'Candid', 'Editorial', 'Product']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  aspectRatio: {
    type: String,
    enum: ['portrait', 'landscape', 'square'],
    default: 'portrait'
  },
  placeholderClass: {
    type: String,
    default: 'placeholder-portrait-1'
  },
  tiltClass: {
    type: String,
    default: 'tilt-left'
  },
  location: String,
  year: String,
  shutter: String,
  aperture: String,
  iso: String,
  imageUrl: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
