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
let dbConnection;
try {
  dbConnection = await connectDB();
  console.log('MongoDB connection established successfully');
} catch (error) {
  console.error('Failed to connect to MongoDB:', error);
  // Don't exit, let the app continue and handle errors through middleware
}

// Enable trust proxy for Vercel
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  'https://carecorner-bl2n.vercel.app', // Frontend URL
  'http://localhost:3000', // Local development
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Data sanitization
app.use(xss());
app.use(hpp());

// Compression
app.use(compression());

// Root route handler
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CareCorner API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      partners: '/api/partners',
      admin: '/api/admin',
      featuredProducts: '/api/featured-products',
      settings: '/api/settings',
      newArrivals: '/api/new-arrivals',
      health: '/api/health'
    },
    documentation: 'API documentation coming soon'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/featured-products', featuredProductRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api', apiRoutes);
app.use('/api/new-arrivals', newArrivalRoutes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize settings
initializeSettings();

// Export the Express API
export default app;

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 