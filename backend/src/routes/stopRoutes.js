const express = require('express');
const router = express.Router();
const {
  addStop,
  updateStop,
  deleteStop,
  reorderStops
} = require('../controllers/stopsController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @openapi
 * components:
 *   schemas:
 *     TripStopInput:
 *       type: object
 *       required:
 *         - city_name
 *         - arrival_date
 *         - departure_date
 *       properties:
 *         city_name:
 *           type: string
 *           example: "Mumbai"
 *         arrival_date:
 *           type: string
 *           example: "01/09/2026"
 *           description: "Arrival date in DD/MM/YYYY format"
 *         departure_date:
 *           type: string
 *           example: "03/09/2026"
 *           description: "Departure date in DD/MM/YYYY format"
 *         sequence_order:
 *           type: integer
 *           example: 1
 *     ReorderStopsInput:
 *       type: object
 *       required:
 *         - stops
 *       properties:
 *         stops:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 10
 *               sequence_order:
 *                 type: integer
 *                 example: 2
 */

/**
 * @openapi
 * /trips/{id}/stops:
 *   post:
 *     summary: Add a city stop to a trip (Accepts dates in DD/MM/YYYY format)
 *     tags: [Trip Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripStopInput'
 *     responses:
 *       201:
 *         description: City stop added to trip successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 */
router.post('/trips/:id/stops', authenticateToken, addStop);

/**
 * @openapi
 * /trips/{id}/stops/reorder:
 *   patch:
 *     summary: Reorder city stops for a trip
 *     tags: [Trip Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReorderStopsInput'
 *     responses:
 *       200:
 *         description: Stops reordered successfully
 *       400:
 *         description: Invalid payload format
 *       404:
 *         description: Trip not found
 */
router.patch('/trips/:id/stops/reorder', authenticateToken, reorderStops);

/**
 * @openapi
 * /stops/{id}:
 *   put:
 *     summary: Edit stop dates & city name (Accepts dates in DD/MM/YYYY format)
 *     tags: [Trip Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the trip stop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city_name:
 *                 type: string
 *                 example: "Goa"
 *               arrival_date:
 *                 type: string
 *                 example: "02/09/2026"
 *               departure_date:
 *                 type: string
 *                 example: "05/09/2026"
 *               sequence_order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Stop updated successfully
 *       404:
 *         description: Stop not found
 */
router.put('/stops/:id', authenticateToken, updateStop);

/**
 * @openapi
 * /stops/{id}:
 *   delete:
 *     summary: Remove a stop from a trip
 *     tags: [Trip Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stop removed successfully
 *       404:
 *         description: Stop not found
 */
router.delete('/stops/:id', authenticateToken, deleteStop);

module.exports = router;
