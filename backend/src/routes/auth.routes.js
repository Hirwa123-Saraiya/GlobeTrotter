const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  logout,
  refreshAccessToken,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const {
  signupValidator,
  loginValidator,
  updateMeValidator,
  deleteMeValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: Account created. Sets accessToken & refreshToken httpOnly cookies.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 */
router.post('/signup', signupValidator, validate, signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Logged in. Sets accessToken & refreshToken httpOnly cookies.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidator, validate, login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user and clear auth cookies
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Not authenticated
 */
router.post('/logout', protect, logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Issue a new access token using the refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed. New cookies are set.
 *       401:
 *         description: Missing or invalid refresh token
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Update the currently authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeRequest'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       409:
 *         description: Email already in use
 */
router.patch('/me', protect, updateMeValidator, validate, updateMe);

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Soft-delete the currently authenticated user's account
 *     description: Marks the account as deleted (data is retained) and revokes all sessions. Requires the current password to confirm.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ss123
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Not authenticated or incorrect password
 */
router.delete('/me', protect, deleteMeValidator, validate, deleteMe);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Generic confirmation message (does not reveal whether the email exists)
 */
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using the token emailed to the user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);

module.exports = router;
