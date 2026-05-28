import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  getAllProducts,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enable admin checks globally for all admin dashboard routes
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
router.get('/products', getAllProducts);

export default router;
