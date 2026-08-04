import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refreshToken,
  getMe,
  googleAuth,
  googleAuthCallback,
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.get('/me', auth, getMe);

// Google OAuth 2.0 (server-side authorization code flow)
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

export default router;
