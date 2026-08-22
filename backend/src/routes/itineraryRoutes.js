const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const { protect } = require('../middlewares/auth.middleware');

/**
 * All itinerary activity endpoints require authentication via JWT cookie
 */
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Itinerary Activities
 *   description: Manage day-wise itinerary activities, times, costs, and drag-and-drop reordering
 */

/**
 * @swagger
 * /itinerary-activities:
 *   post:
 *     summary: Schedule a new activity under a trip stop
 *     tags: [Itinerary Activities]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trip_stop_id
 *               - custom_title
 *               - scheduled_date
 *             properties:
 *               trip_stop_id:
 *                 type: integer
 *                 example: 101
 *               custom_title:
 *                 type: string
 *                 example: Visit Gateway of India & Taj Hotel
 *               category:
 *                 type: string
 *                 example: Sightseeing
 *               scheduled_date:
 *                 type: string
 *                 description: Date in DD/MM/YYYY format
 *                 example: 01/09/2026
 *               start_time:
 *                 type: string
 *                 example: 09:30 AM
 *               end_time:
 *                 type: string
 *                 example: 12:00 PM
 *               custom_cost:
 *                 type: number
 *                 example: 1500.00
 *               notes:
 *                 type: string
 *                 example: Pre-book ferry tickets online for Elephanta caves
 *     responses:
 *       201:
 *         description: Activity scheduled successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post('/', itineraryController.addActivity);

/**
 * @swagger
 * /itinerary-activities/reorder:
 *   patch:
 *     summary: Reorder activities sequence for a trip stop
 *     tags: [Itinerary Activities]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trip_stop_id
 *               - activities
 *             properties:
 *               trip_stop_id:
 *                 type: integer
 *                 example: 101
 *               activities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     sequence_order:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Activities reordered successfully
 *       400:
 *         description: Missing parameters
 */
router.patch('/reorder', itineraryController.reorderActivities);

/**
 * @swagger
 * /itinerary-activities/{id}:
 *   put:
 *     summary: Update a scheduled activity details
 *     tags: [Itinerary Activities]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               custom_title:
 *                 type: string
 *                 example: Sunset Ferry Cruise
 *               category:
 *                 type: string
 *                 example: Adventure
 *               scheduled_date:
 *                 type: string
 *                 example: 02/09/2026
 *               start_time:
 *                 type: string
 *                 example: 05:30 PM
 *               end_time:
 *                 type: string
 *                 example: 07:30 PM
 *               custom_cost:
 *                 type: number
 *                 example: 2500.00
 *               notes:
 *                 type: string
 *                 example: Bring camera for photography
 *     responses:
 *       200:
 *         description: Activity updated successfully
 *       404:
 *         description: Activity not found
 */
router.put('/:id', itineraryController.updateActivity);

/**
 * @swagger
 * /itinerary-activities/{id}:
 *   delete:
 *     summary: Delete a scheduled activity
 *     tags: [Itinerary Activities]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity ID
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 *       404:
 *         description: Activity not found
 */
router.delete('/:id', itineraryController.deleteActivity);

module.exports = router;
