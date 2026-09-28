const GalleryItem = require('../models/GalleryItem');
const { getGallery, addGalleryItem, updateGalleryItem: updateMemGallery, deleteGalleryItem: deleteMemGallery } = require('../data/inMemoryStore');
const mongoose = require('mongoose');

/**
 * @desc   Get all gallery photo frames
 * @route  GET /api/gallery
 * @access Public
 */
const getGalleryItems = async (req, res, next) => {
  try {
    const { category } = req.query;

    // Check if MongoDB is connected and has records
    if (mongoose.connection.readyState === 1) {
      const query = category ? { category: new RegExp(category, 'i') } : {};
      const dbItems = await GalleryItem.find(query);
      if (dbItems && dbItems.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbItems.length,
          data: dbItems,
          source: 'database'
        });
      }
    }

    // In-code data fallback
    let items = getGallery();
    if (category && category !== 'All') {
      items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
      source: 'in-code'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single gallery frame by ID
 * @route  GET /api/gallery/:id
 * @access Public
 */
const getGalleryItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const dbItem = await GalleryItem.findById(id);
      if (dbItem) {
        return res.status(200).json({
          success: true,
          data: dbItem
        });
      }
    }

    const item = getGallery().find(g => g.id === id || g._id === id || g.frameNumber.toLowerCase() === id.toLowerCase());

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Frame with ID ${id} not found in darkroom archives`
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new gallery frame
 * @route  POST /api/gallery
 * @access Protected (Admin Passkey)
 */
const createGalleryItem = async (req, res, next) => {
  try {
    const itemData = req.body;

    if (mongoose.connection.readyState === 1) {
      const newItem = await GalleryItem.create(itemData);
      return res.status(201).json({
        success: true,
        message: 'New photo frame added to darkroom archives.',
        data: newItem
      });
    }

    const saved = addGalleryItem(itemData);
    res.status(201).json({
      success: true,
      message: 'New photo frame added to darkroom archives.',
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update existing gallery frame
 * @route  PUT /api/gallery/:id
 * @access Protected (Admin Passkey)
 */
const updateGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (mongoose.connection.readyState === 1) {
      const updated = await GalleryItem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found in database.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Gallery frame updated successfully.',
        data: updated
      });
    }

    const updatedMem = updateMemGallery(id, updateData);
    if (!updatedMem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery frame not found in archives.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery frame updated successfully.',
      data: updatedMem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete gallery frame
 * @route  DELETE /api/gallery/:id
 * @access Protected (Admin Passkey)
 */
const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deleted = await GalleryItem.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found in database.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Gallery frame removed from archives.'
      });
    }

    const removed = deleteMemGallery(id);
    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Gallery frame not found in archives.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery frame removed from archives.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
