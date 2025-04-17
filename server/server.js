import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import featuredProductRoutes from './routes/featuredProductRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { initializeSettings } from './controllers/settingController.js';
import newArrivalRoutes from './routes/newArrivalRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

// Create Express app
const app = express();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
connectDB();

app.get('/', (req,res) => {
  res.json('Welcom to Care Corner API');
})
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5173", "http://localhost:5001", "https://api.alphavantage.co", "https://newsdata.io", "https://carecorner-bl2n.vercel.app", "https://carecorner-bl2n-9thaviglq-yonatans-projects-2f1159da.vercel.app", "https://carecorner-bl2n-ch67jcegb-yonatans-projects-2f1159da.vercel.app", "https://carecorner-phi.vercel.app"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
})); // Adds various HTTP headers for security

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://carecorner-bl2n.vercel.app',
    'https://carecorner-phi.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(globalLimiter);

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization
app.use(xss()); // Sanitize data
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Compression
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/featured-products', featuredProductRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/external', apiRoutes);
app.use('/api/new-arrivals', newArrivalRoutes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

// Initialize settings
initializeSettings();

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 