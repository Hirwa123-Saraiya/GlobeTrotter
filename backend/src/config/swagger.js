const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'GlobeTrotter API Documentation',
    version: '1.0.0',
    description: 'RESTful API for GlobeTrotter personalized travel planning platform',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
