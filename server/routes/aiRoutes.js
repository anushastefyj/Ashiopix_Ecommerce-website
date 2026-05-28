import express from 'express';
import {
  getSimilarProducts,
  getUserRecommendations,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/products/:id', getSimilarProducts);
router.get('/user/:userId', protect, getUserRecommendations);

export default router;
