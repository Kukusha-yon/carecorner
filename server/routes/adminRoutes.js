import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import { auditLogger } from '../middleware/auditLogger.js';
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
  getDashboard,
  getOrderStats,
  getProductStats,
  getCustomerStats,
  createUser
} from '../controllers/adminController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Apply rate limiting and audit logging to all admin routes
router.use(protect);
router.use(admin);
router.use(adminLimiter);
router.use(auditLogger);

// Dashboard routes
router.get('/stats', getStats);
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);

// User management routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Statistics routes
router.get('/orders/stats', getOrderStats);
router.get('/products/stats', getProductStats);
router.get('/customers/stats', getCustomerStats);

// Settings routes
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);

export default router; 