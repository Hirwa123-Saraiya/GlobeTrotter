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
const { sendOtpEmail } = require('../utils/email.util');

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
    data: { user: userModel.toSafeUser(user) },
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
    data: { user: userModel.toSafeUser(user) },
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
 * @desc    Issue a new access token using the refresh token cookie
 * @route   POST /api/auth/refresh-token
 * @access  Public (requires valid refreshToken cookie)
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(401, 'Refresh token missing. Please log in again.');
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

  const { accessToken, refreshToken } = issueTokensForUser(user);
  setAuthCookies(res, { accessToken, refreshToken });

  res.status(200).json({ success: true, message: 'Access token refreshed.' });
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
 * @desc    Generate and email a password reset OTP for the given email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findByEmail(email);

  // Always respond the same way, whether or not the email exists, to avoid leaking account info
  const genericResponse = {
    success: true,
    message: 'If an account with that email exists, a password reset code has been sent.',
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await userModel.setPasswordResetToken(user.id, hashedOtp, expiresAt);
  await sendOtpEmail(user.email, otp);

  res.status(200).json(genericResponse);
});

/**
 * @desc    Reset password using the OTP emailed to the user
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await userModel.findByEmailAndValidResetToken(email, hashedOtp);
  if (!user) {
    throw new ApiError(400, 'Reset code is invalid or has expired.');
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
  forgotPassword,
  resetPassword,
};
