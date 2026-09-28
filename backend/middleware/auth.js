/**
 * Aperture & Ash — Administrative Authentication Middleware
 * Protects administrative routes via secret passkey verification.
 */

const adminAuth = (req, res, next) => {
  const adminPasskey = process.env.ADMIN_PASSKEY || 'aperture2026';

  // Read passkey from 'x-admin-passkey' header or 'Authorization: Bearer <passkey>'
  const headerPasskey = req.headers['x-admin-passkey'];
  const authHeader = req.headers['authorization'];

  let providedPasskey = headerPasskey;

  if (!providedPasskey && authHeader && authHeader.startsWith('Bearer ')) {
    providedPasskey = authHeader.split(' ')[1];
  }

  // Also check query param if passed
  if (!providedPasskey && req.query && req.query.passkey) {
    providedPasskey = req.query.passkey;
  }

  if (!providedPasskey) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Administrative passkey is required to access studio ledger archives.'
    });
  }

  if (providedPasskey !== adminPasskey) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid studio passkey provided.'
    });
  }

  // Passkey is valid, proceed
  req.isAdmin = true;
  next();
};

module.exports = { adminAuth };
