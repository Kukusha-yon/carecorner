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
    value: err.value
  });

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Map error types to status codes and messages
  const errorTypes = {
    ValidationError: {
      status: 400,
      message: 'Validation Error',
      getErrors: (err) => Object.values(err.errors).map(error => error.message)
    },
    CastError: {
      status: 400,
      message: 'Invalid ID format',
      getDetails: (err) => `Invalid ${err.path}: ${err.value}`
    },
    JsonWebTokenError: {
      status: 401,
      message: 'Invalid token. Please log in again.'
    },
    TokenExpiredError: {
      status: 401,
      message: 'Token expired. Please log in again.'
    },
    UnauthorizedError: {
      status: 401,
      message: 'Unauthorized access'
    },
    ForbiddenError: {
      status: 403,
      message: 'Forbidden access'
    },
    NotFoundError: {
      status: 404,
      message: 'Resource not found'
    },
    ConflictError: {
      status: 409,
      message: 'Resource conflict'
    }
  };

  // Handle known error types
  const errorType = errorTypes[err.name];
  if (errorType) {
    return res.status(errorType.status).json({
      success: false,
      message: errorType.message,
      ...(errorType.getErrors && { errors: errorType.getErrors(err) }),
      ...(errorType.getDetails && { details: errorType.getDetails(err) }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate field value: ${field}. Please use another value.`,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 