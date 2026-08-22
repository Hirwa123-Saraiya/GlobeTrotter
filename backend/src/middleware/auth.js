const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Validates Authorization header (Bearer <token>).
 * If no token is provided in development mode, assigns a default fallback user (user_id = 1)
 * to facilitate manual testing with Postman / cURL / Swagger.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // In development mode, allow fallback demo user if token is missing
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      req.user = { id: 1, email: 'demo@globetrotter.com', name: 'Demo Traveler' };
      return next();
    }
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'globetrotter_super_secret_jwt_key_2026', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
