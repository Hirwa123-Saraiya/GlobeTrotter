const { body } = require('express-validator');

const signupValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 100 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 100 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

const loginValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateMeValidator = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty').isLength({ max: 100 }),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty').isLength({ max: 100 }),
  body('email').optional().trim().notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Provide a valid email'),
  body('profilePhotoUrl').optional({ nullable: true }).isURL().withMessage('Profile photo must be a valid URL'),
];

const deleteMeValidator = [
  body('password').notEmpty().withMessage('Password is required to confirm account deletion'),
];

const forgotPasswordValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Provide a valid email'),
];

const resetPasswordValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Provide a valid email'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must be 6 digits'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

module.exports = {
  signupValidator,
  loginValidator,
  updateMeValidator,
  deleteMeValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
