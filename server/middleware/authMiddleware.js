import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../config/jwt.js';

// @desc    Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      console.log('Verifying token for request to:', req.originalUrl);
      
      // Verify token using our JWT utility
      const decoded = verifyToken(token);
      console.log('Token decoded successfully, user ID:', decoded.userId);
      
      // Get user from the token
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.error('User not found with ID:', decoded.userId);
        throw new AppError('Not authorized, user not found', 401);
      }
      
      console.log('User authenticated:', user.email, 'Role:', user.role);
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token expired, please log in again', 401);
      } else if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token signature', 401);
      } else {
        throw new AppError(error.message || 'Authentication failed', 401);
      }
    }
  } else {
    throw new AppError('Not authorized, no token', 401);
  }
});

// @desc    Admin middleware
export const admin = asyncHandler(async (req, res, next) => {
  console.log('Admin middleware called for path:', req.originalUrl);
  console.log('User in admin middleware:', req.user ? { id: req.user._id, role: req.user.role } : 'No user');
  
  if (req.user && req.user.role === 'admin') {
    console.log('User is admin, proceeding');
    next();
  } else {
    console.log('User is not admin, returning 403');
    throw new AppError('Not authorized as an admin', 403);
  }
}); 