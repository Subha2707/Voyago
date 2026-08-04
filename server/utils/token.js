import jwt from 'jsonwebtoken';

/**
 * Generate a short-lived access token (15 minutes).
 * @param {string} userId - MongoDB user _id
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId.toString() },
    process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    { expiresIn: '15m' }
  );
};

/**
 * Generate a long-lived refresh token (7 days).
 * @param {string} userId - MongoDB user _id
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId.toString() },
    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    { expiresIn: '7d' }
  );
};

/**
 * Verify and decode an access token.
 * Throws if invalid or expired.
 * @param {string} token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'default_access_secret');
};

/**
 * Verify and decode a refresh token.
 * Throws if invalid or expired.
 * @param {string} token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret');
};
