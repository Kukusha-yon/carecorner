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

// Create Express app
const app = express();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log the error but don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log the error but don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Connect to MongoDB with error handling
try {
  await connectDB();
} catch (error) {
  console.error('MongoDB connection error:', error);
  // Don't exit the process, allow the app to continue running
}

// Security middleware with error handling
try {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5173", "https://carecorner-az5h51aua-yonatans-projects-2f1159da.vercel.app"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
} catch (error) {
  console.error('Error setting up helmet:', error);
}

// CORS middleware with error handling
try {
  app.use(cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:5173',
      'https://carecorner-az5h51aua-yonatans-projects-2f1159da.vercel.app'
    ],
    credentials: true
  }));
} catch (error) {
  console.error('Error setting up CORS:', error);
}

// Body parser with size limits and error handling
app.use(express.json({ 
  limit: '10kb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Add a simple test endpoint with error handling
app.get('/api/test', (req, res) => {
  try {
    res.json({ 
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a root route handler with error handling
app.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'CareCorner API is running',
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: [
        '/api/test',
        '/api/auth',
        '/api/products',
        '/api/orders',
        '/api/partners',
        '/api/admin',
        '/api/featured-products',
        '/api/settings',
        '/api/external',
        '/api/new-arrivals'
      ]
    });
  } catch (error) {
    console.error('Error in root endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    const healthCheck = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    res.json(healthCheck);
  } catch (error) {
    console.error('Error in health check endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes with error handling
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/featured-products', featuredProductRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/external', apiRoutes);
app.use('/api/new-arrivals', newArrivalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize settings with error handling
try {
  await initializeSettings();
} catch (error) {
  console.error('Error initializing settings:', error);
}

// Start server with error handling
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Export for Vercel
export default app; 