const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const { adminAuth } = require('../middleware/auth');

// Public gallery viewing
router.get('/', getGalleryItems);
router.get('/:id', getGalleryItemById);

// Protected administrative gallery management
router.post('/', adminAuth, createGalleryItem);
router.put('/:id', adminAuth, updateGalleryItem);
router.delete('/:id', adminAuth, deleteGalleryItem);

module.exports = router;
