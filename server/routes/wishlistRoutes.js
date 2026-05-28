import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist);

router.post('/add', addToWishlist);

router.route('/:productId')
  .delete(removeFromWishlist);

export default router;
