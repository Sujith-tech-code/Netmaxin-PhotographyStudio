const studioData = require('../data/studioData');

/**
 * @desc   Get studio story, stats, and gear specs
 * @route  GET /api/studio
 * @access Public
 */
const getStudioInfo = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: studioData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudioInfo
};
