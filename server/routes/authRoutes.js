import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  logoutUser,
  refreshAccessToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.get('/profile', protect, getUserProfile);

export default router;
