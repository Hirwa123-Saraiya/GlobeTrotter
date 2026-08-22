const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const tripRoutes = require('./routes/tripRoutes');
const stopRoutes = require('./routes/stopRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger OpenAPI Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/trips', tripRoutes);
app.use('/api', stopRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GlobeTrotter API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
