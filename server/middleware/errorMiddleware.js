import { AppError } from '../utils/AppError.js';

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    path: err.path,
    value: err.value,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate field value: ${field}. Please use another value.`,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(500).json({
      success: false,
      message: 'Database connection error. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please log in again.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err.message
    })
  });
}; 