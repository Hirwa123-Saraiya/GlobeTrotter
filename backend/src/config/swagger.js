const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'GlobeTrotter API',
      version: '1.0.0',
      description:
        'API documentation for GlobeTrotter — a personalized, collaborative travel planning platform. ' +
        'This spec currently covers the Authentication module (Signup, Login, Logout, Refresh Token, ' +
        'Forgot/Reset Password, Current User).',
      contact: {
        name: 'GlobeTrotter Backend Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local development server',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'User authentication & session management',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description:
            'JWT access token is set automatically as an httpOnly cookie after login/signup. ' +
            'No manual header is required when calling this API from a browser with credentials included.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'b3f1c1b0-1234-4a5b-9c6d-abcdef123456' },
            firstName: { type: 'string', example: 'Aarav' },
            lastName: { type: 'string', example: 'Shah' },
            email: { type: 'string', format: 'email', example: 'aarav@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string', example: 'Aarav' },
            lastName: { type: 'string', example: 'Shah' },
            email: { type: 'string', format: 'email', example: 'aarav@example.com' },
            password: { type: 'string', format: 'password', example: 'StrongP@ss123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'aarav@example.com' },
            password: { type: 'string', format: 'password', example: 'StrongP@ss123' },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'aarav@example.com' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'otp', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'aarav@example.com' },
            otp: { type: 'string', example: '123456' },
            password: { type: 'string', format: 'password', example: 'NewStrongP@ss123' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Something went wrong' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
