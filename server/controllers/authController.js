import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js';
import {
  getRedirectUri,
  isGoogleConfigured,
  generateOAuthState,
  getGoogleAuthUrl,
  exchangeCodeForToken,
  decodeIdToken,
} from '../services/googleAuth.js';
import { isEmailConfigured, sendOtpEmail } from '../services/email.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Cookie must be SameSite=None + Secure in production because the Netlify
// frontend and the Render backend are different sites (cross-site fetch).
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge,
});

// Short-lived in-memory CSRF state for the Google OAuth dance.
// Fine on Render free tier (single instance); each state lives 10 minutes.
const oauthStates = new Map();
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

const cleanupOauthStates = () => {
  const now = Date.now();
  for (const [key, exp] of oauthStates) {
    if (exp < now) oauthStates.delete(key);
  }
};

// ── Register ──────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, phone, password) are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      isVerified: true,
    });

    console.log(`✅ New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Registered successfully. Please login.',
    });
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Accounts created via Google have no password.
    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google sign-in. Please continue with Google.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token as httpOnly cookie (7 days)
    res.cookie('refreshToken', refreshToken, cookieOptions(SEVEN_DAYS_MS));

    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', cookieOptions(SEVEN_DAYS_MS));

    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Google OAuth 2.0 (Authorization Code flow) ────────────────────────────────
export const googleAuth = (req, res, next) => {
  try {
    if (!isGoogleConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Google sign-in is not configured on the server.',
      });
    }

    const state = generateOAuthState();
    oauthStates.set(state, Date.now() + OAUTH_STATE_TTL_MS);
    cleanupOauthStates();

    const redirectUri = getRedirectUri(req);
    res.redirect(getGoogleAuthUrl(state, redirectUri));
  } catch (error) {
    next(error);
  }
};

export const googleAuthCallback = async (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const fail = (err) => res.redirect(`${clientUrl}/google/callback?error=${encodeURIComponent(err)}`);

  try {
    const { code, state, error: googleError } = req.query;

    if (googleError) return fail(googleError);
    if (!code || !state) return fail('invalid_request');

    const exp = oauthStates.get(state);
    oauthStates.delete(state);
    if (!exp || exp < Date.now()) return fail('invalid_state');

    const redirectUri = getRedirectUri(req);
    const tokenData = await exchangeCodeForToken(code, redirectUri);
    const profile = decodeIdToken(tokenData.id_token);

    // Validate the ID token payload.
    if (profile.aud !== process.env.GOOGLE_CLIENT_ID) return fail('invalid_audience');
    if (!profile.email || profile.email_verified !== true) return fail('unverified_email');

    const email = profile.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.name || email.split('@')[0],
        email,
        googleId: profile.sub,
        avatar: profile.picture,
        authProvider: 'google',
        isVerified: true,
      });
      console.log(`✅ New Google user: ${user.email}`);
    } else {
      if (!user.googleId) user.googleId = profile.sub;
      if (!user.avatar && profile.picture) user.avatar = profile.picture;
      user.lastActive = new Date();
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie('refreshToken', refreshToken, cookieOptions(SEVEN_DAYS_MS));

    const params = new URLSearchParams({
      accessToken,
      userId: user._id.toString(),
      name: user.name || '',
      email: user.email,
      avatar: user.avatar || '',
    });
    res.redirect(`${clientUrl}/google/callback?${params.toString()}`);
  } catch (error) {
    next(error);
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Generic success regardless of whether the user exists (no enumeration).
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset code has been sent.',
      });
    }

    // Google-only accounts can't reset a password they don't have.
    if (!user.passwordHash) {
      return res.json({
        success: true,
        message: 'This account uses Google sign-in. Please continue with Google instead.',
      });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    user.passwordResetOtp = await bcrypt.hash(otp, 10);
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetAttempts = 0;
    await user.save();

    if (isEmailConfigured()) {
      try {
        await sendOtpEmail({ to: user.email, name: user.name, otp });
      } catch (emailErr) {
        console.error('❌ Failed to send reset email:', emailErr.message);
        user.passwordResetOtp = undefined;
        user.passwordResetExpiresAt = undefined;
        await user.save();
        return res.status(502).json({
          success: false,
          message: 'Could not send the reset email. Please try again shortly.',
        });
      }
      return res.json({
        success: true,
        message: 'A 6-digit reset code has been sent to your email.',
      });
    }

    // DEV FALLBACK (no Resend key): log the OTP and echo it so local testing works.
    console.log(`🔐 DEV OTP for ${user.email}: ${otp}`);
    return res.json({
      success: true,
      devOtp: otp,
      message: `DEV MODE: Use code ${otp}`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Verify OTP ────────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!user.passwordResetOtp || !user.passwordResetExpiresAt) {
      return res
        .status(400)
        .json({ success: false, message: 'No active reset request. Please request a new code.' });
    }

    if (new Date(user.passwordResetExpiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'Code expired. Please request a new one.' });
    }

    if (user.passwordResetAttempts >= 5) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Please request a new code.' });
    }

    const isMatch = await bcrypt.compare(otp, user.passwordResetOtp);
    if (!isMatch) {
      user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
      await user.save();
      return res.status(400).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    // Consume the OTP so it can't be replayed.
    user.passwordResetOtp = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetAttempts = undefined;
    await user.save();

    // Issue short-lived reset token (10 min)
    const resetToken = jwt.sign(
      { email: user.email, purpose: 'reset' },
      process.env.JWT_ACCESS_SECRET || 'default_access_secret',
      { expiresIn: '10m' }
    );

    console.log(`✅ OTP verified for ${email}`);

    res.json({ success: true, resetToken });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Verify and decode the reset token
    let decoded;
    try {
      decoded = jwt.verify(
        resetToken,
        process.env.JWT_ACCESS_SECRET || 'default_access_secret'
      );
    } catch {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired reset token.' });
    }

    if (decoded.purpose !== 'reset') {
      return res.status(400).json({ success: false, message: 'Invalid reset token.' });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    console.log(`✅ Password reset for: ${user.email}`);

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── Refresh Token ─────────────────────────────────────────────────────────────
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'No refresh token provided.' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired refresh token. Please login again.' });
    }

    const accessToken = generateAccessToken(decoded.id);

    res.json({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
};

// ── Get Me ────────────────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || null,
        authProvider: user.authProvider || 'email',
        savedTripsCount: user.savedTrips?.length || 0,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
