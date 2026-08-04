import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware.
 * Reads Bearer token from Authorization header,
 * verifies with JWT_ACCESS_SECRET, attaches req.user.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'default_access_secret'
    );

    req.user = decoded; // { id, iat, exp }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ success: false, message: 'Token expired. Please refresh your session.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

export default authMiddleware;
