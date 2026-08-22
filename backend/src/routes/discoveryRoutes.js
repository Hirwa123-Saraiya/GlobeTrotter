const express = require('express');
const router = express.Router();
const discoveryController = require('../controllers/discoveryController');

/**
 * @swagger
 * tags:
 *   name: Discovery Catalog
 *   description: Search and discover global cities and activity recommendations
 */

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Search and list destination cities
 *     tags: [Discovery Catalog]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for city or country name
 *     responses:
 *       200:
 *         description: List of matching cities
 */
router.get('/cities', discoveryController.getCities);

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Search and list recommended travel activities
 *     tags: [Discovery Catalog]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for activity title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter (Sightseeing, Food & Dining, Adventure, Culture & Heritage)
 *     responses:
 *       200:
 *         description: List of matching activities
 */
router.get('/activities', discoveryController.getActivities);

module.exports = router;
