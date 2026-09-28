/**
 * Request Validation Middleware for Booking Inquiries
 */

const validateBookingInput = (req, res, next) => {
  const { clientName, clientEmail, sessionType, message } = req.body;
  const errors = [];

  // Name check
  if (!clientName || typeof clientName !== 'string' || !clientName.trim()) {
    errors.push({ field: 'clientName', message: 'Name is required.' });
  }

  // Email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!clientEmail || !emailRegex.test(clientEmail.trim())) {
    errors.push({ field: 'clientEmail', message: 'A valid email address is required.' });
  }

  // Session type check
  const validSessionTypes = ['portrait', 'wedding', 'commercial', 'still-life', 'editorial', 'other'];
  if (!sessionType || !validSessionTypes.includes(sessionType.toLowerCase())) {
    errors.push({ field: 'sessionType', message: 'Please select a valid session type.' });
  }

  // Message check
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the provided inputs.',
      errors
    });
  }

  next();
};

module.exports = {
  validateBookingInput
};
