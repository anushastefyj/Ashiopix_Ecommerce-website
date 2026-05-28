import express from 'express';
import {
  getUserById,
  updateUserProfile,
  getUserOrders,
  addUserAddress,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/:id')
  .get(getUserById)
  .put(updateUserProfile);

router.route('/:id/orders')
  .get(getUserOrders);

router.route('/:id/address')
  .post(addUserAddress);

export default router;
