import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // protect all cart endpoints

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/add', addToCart);

router.route('/:productId')
  .put(updateCartItem)
  .delete(removeCartItem);

export default router;
