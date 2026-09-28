const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();
const connectDB = require('./config/db');
// Connect to Database
connectDB();

// Route Handlers
const galleryRoutes = require('./routes/galleryRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const studioRoutes = require('./routes/studioRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware Handlers
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');







// Middlewares - Dynamic CORS handling Vercel, localhost, and custom domains
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, render health checks)
    if (!origin) return callback(null, true);

    // Allow configured local/production client URLs
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow any Vercel preview or production deployments
    if (origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    return callback(null, true); // Permissive for API consumers
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route - Solves Render health check & gives welcome message
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    studio: 'Aperture & Ash — Analog Photography & Darkroom API',
    uptime: process.uptime(),
    health: '/api/health',
    endpoints: {
      gallery: '/api/gallery',
      pricing: '/api/pricing',
      studio: '/api/studio',
      bookings: '/api/bookings',
      admin: '/api/admin'
    }
  });
});

// Welcome API Route
app.get('/api', (req, res) => {
  res.json({
    studio: 'Aperture & Ash — Analog Photography & Darkroom',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      gallery: 'GET /api/gallery',
      pricing: 'GET /api/pricing',
      studio: 'GET /api/studio',
      bookings: 'POST /api/bookings | GET /api/bookings (Admin)',
      admin: 'POST /api/admin/verify | GET /api/admin/stats'
    }
  });
});

// Health Check API for monitoring services
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    studio: 'Aperture & Ash',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount Resource Routes
app.use('/api/gallery', galleryRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/studio', studioRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Server Port
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] Aperture & Ash backend active on port ${PORT}`);
  });
}

module.exports = app;
