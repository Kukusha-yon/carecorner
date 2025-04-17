import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get environment information
    const env = process.env.NODE_ENV || 'development';
    
    // Get server information
    const serverInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env,
      version: '1.0.0',
      message: 'API is healthy and responding correctly',
      database: {
        status: dbStatus,
        host: mongoose.connection.host || 'unknown',
        name: mongoose.connection.name || 'unknown'
      },
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    res.status(200).json(serverInfo);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

export default router; 