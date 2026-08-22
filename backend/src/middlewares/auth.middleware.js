const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyAccessToken } = require('../utils/jwt.util');
const { findById, toSafeUser } = require('../models/user.model');

/**
 * protect: verifies the JWT access token stored in the httpOnly `accessToken` cookie
 * and attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session expired. Please refresh your token or log in again.');
    }
    throw new ApiError(401, 'Invalid authentication token.');
  }

  const user = await findById(decoded.sub);
  if (!user) {
    throw new ApiError(401, 'User belonging to this token no longer exists.');
  }

  req.user = toSafeUser(user);
  req.userRow = user; // full row (with refresh_token_version) for controllers that need it
  next();
});

module.exports = { protect };
