import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getOrderInvoice,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus);

router.route('/:id/invoice')
  .get(protect, getOrderInvoice);

export default router;
