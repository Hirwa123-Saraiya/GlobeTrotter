const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require('../utils/jwt.util');
const userModel = require('../models/user.model');

const issueTokensForUser = (userRow) => {
  const accessToken = generateAccessToken({ sub: userRow.id });
  const refreshToken = generateRefreshToken({ sub: userRow.id, v: userRow.refresh_token_version });
  return { accessToken, refreshToken };
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await userModel.createUser({ firstName, lastName, email, password });

  const { accessToken, refreshToken } = issueTokensForUser(user);
  setAuthCookies(res, { accessToken, refreshToken });

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { 
      user: userModel.toSafeUser(user),
      accessToken,
      refreshToken
    },
  });
});

/**
 * @desc    Authenticate a user and set JWT cookies
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user || !(await userModel.comparePassword(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const { accessToken, refreshToken } = issueTokensForUser(user);
  setAuthCookies(res, { accessToken, refreshToken });

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: { 
      user: userModel.toSafeUser(user),
      accessToken,
      refreshToken
    },
  });
});

/**
 * @desc    Log the user out: clear cookies and invalidate outstanding refresh tokens
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  if (req.userRow) {
    await userModel.incrementRefreshTokenVersion(req.userRow.id);
  }
  clearAuthCookies(res);
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

/**
 * @desc    Issue a new access token using the refresh token cookie or request payload
 * @route   POST /api/auth/refresh-token
 * @access  Public (requires valid refreshToken cookie or body)
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken || req.headers['x-refresh-token'];
  if (!token) {
    throw new ApiError(401, 'Refresh token missing from cookies and request payload. Please log in again.');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token. Please log in again.');
  }

  const user = await userModel.findById(decoded.sub);
  if (!user || user.refresh_token_version !== decoded.v) {
    throw new ApiError(401, 'Refresh token no longer valid. Please log in again.');
  }

  const { accessToken, refreshToken: newRefreshToken } = issueTokensForUser(user);
  setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });

  console.log(`[AUTH REFRESH] Access token refreshed successfully for user ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Access token refreshed successfully.',
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});

/**
 * @desc    Return the currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current user fetched successfully.',
    data: { user: req.user },
  });
});

/**
 * @desc    Update current user profile
 * @route   PATCH /api/auth/me
 * @access  Private
 */
const updateMe = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, profilePhotoUrl } = req.body;
  const updatedUser = await userModel.updateUser(req.user.id, { firstName, lastName, email, profilePhotoUrl });
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { user: userModel.toSafeUser(updatedUser) }
  });
});

/**
 * @desc    Soft delete user account
 * @route   DELETE /api/auth/me
 * @access  Private
 */
const deleteMe = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await userModel.findById(req.user.id);
  if (!user || !(await userModel.comparePassword(password, user.password))) {
    throw new ApiError(401, 'Incorrect password. Account deletion aborted.');
  }

  await userModel.softDeleteUser(user.id);
  clearAuthCookies(res);
  res.status(200).json({ success: true, message: 'Account soft-deleted successfully.' });
});

/**
 * @desc    Generate a password reset token for the given email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findByEmail(email);

  const genericResponse = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await userModel.setPasswordResetToken(user.id, hashedToken, expiresAt);

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}`;
  console.log(`Password reset link for ${user.email}: ${resetUrl}`);

  res.status(200).json(genericResponse);
});

/**
 * @desc    Reset password using a valid reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await userModel.findByValidResetToken(hashedToken);
  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired.');
  }

  await userModel.resetPassword(user.id, password);

  clearAuthCookies(res);
  res.status(200).json({ success: true, message: 'Password reset successfully. Please log in again.' });
});

module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword,
};
