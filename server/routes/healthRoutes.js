import express from 'express';
import mongoose from 'mongoose';
import os from 'os';

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
      status: dbStatus === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: env,
      version: '1.0.0',
      message: dbStatus === 'connected' 
        ? 'API is healthy and responding correctly' 
        : 'API is responding but database connection is not established',
      database: {
        status: dbStatus,
        host: mongoose.connection.host || 'unknown',
        name: mongoose.connection.name || 'unknown',
        readyState: mongoose.connection.readyState
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: process.memoryUsage()
        },
        uptime: process.uptime()
      },
      request: {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        headers: {
          host: req.headers.host,
          'user-agent': req.headers['user-agent']
        }
      }
    };
    
    // Return 200 even if database is not connected
    // This allows the API to respond even if there are database issues
    res.status(200).json(serverInfo);
  } catch (error) {
    console.error('Health check error:', error);
    // Return 200 even on error to ensure the health check endpoint always responds
    res.status(200).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check encountered an error but API is still responding',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

export default router; 