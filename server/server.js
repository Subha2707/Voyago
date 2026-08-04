import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import placesRoutes from './routes/placesRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import estimateRoutes from './routes/estimateRoutes.js';
import compareRoutes from './routes/compareRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import rateRoutes from './routes/rateRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust the first proxy (Render/Netlify terminate TLS) so req.protocol is
// https and Secure cookies are set correctly in production.
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Rate Limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes.',
  },
});

// Core Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(limiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Voyago API is running ðŸš€',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/rates', rateRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Global Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`ðŸš€ Voyago server running on http://localhost:${PORT}`);
  console.log(`ðŸ“ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`ðŸŒ CORS origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

export default app;
