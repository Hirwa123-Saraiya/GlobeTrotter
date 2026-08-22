const express = require('express');
const router = express.Router();
const {
  getTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  shareTrip,
  copyTrip
} = require('../controllers/tripsController');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @openapi
 * components:
 *   schemas:
 *     TripInput:
 *       type: object
 *       required:
 *         - name
 *         - start_date
 *         - end_date
 *       properties:
 *         name:
 *           type: string
 *           example: "Coastal India Escape"
 *         description:
 *           type: string
 *           example: "8-day journey across Mumbai, Goa, and Bengaluru"
 *         start_date:
 *           type: string
 *           example: "01/09/2026"
 *           description: "Date in DD/MM/YYYY format"
 *         end_date:
 *           type: string
 *           example: "08/09/2026"
 *           description: "Date in DD/MM/YYYY format"
 *         total_budget:
 *           type: number
 *           example: 60000
 *         vibe:
 *           type: string
 *           example: "Food & Beach"
 *         cover_image:
 *           type: string
 *           example: "https://images.unsplash.com/photo-1488646953014-85cb44e25828"
 *     TripResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         start_date:
 *           type: string
 *           example: "01/09/2026"
 *         end_date:
 *           type: string
 *           example: "08/09/2026"
 *         total_budget:
 *           type: number
 *         vibe:
 *           type: string
 *         status:
 *           type: string
 *         is_public:
 *           type: boolean
 *         share_token:
 *           type: string
 *         created_at:
 *           type: string
 *           example: "22/08/2026"
 */

/**
 * @openapi
 * /trips:
 *   get:
 *     summary: List all user trips (All dates in DD/MM/YYYY format)
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user trips list with DD/MM/YYYY dates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TripResponse'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/', protect, getTrips);

/**
 * @openapi
 * /trips:
 *   post:
 *     summary: Create a new trip (Accepts dates in DD/MM/YYYY format)
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripInput'
 *     responses:
 *       201:
 *         description: Trip created successfully with DD/MM/YYYY dates
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/', protect, createTrip);

/**
 * @openapi
 * /trips/{id}:
 *   get:
 *     summary: Fetch detailed trip data with DD/MM/YYYY date formatting
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detailed trip object with DD/MM/YYYY date fields
 *       404:
 *         description: Trip not found
 *       403:
 *         description: Private trip access forbidden
 */
router.get('/:id', protect, getTripById);

/**
 * @openapi
 * /trips/{id}:
 *   put:
 *     summary: Update trip metadata & budget (Accepts dates in DD/MM/YYYY format)
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
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
 *             $ref: '#/components/schemas/TripInput'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       403:
 *         description: Unauthorized edit attempt
 *       404:
 *         description: Trip not found
 */
router.put('/:id', protect, updateTrip);

/**
 * @openapi
 * /trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       403:
 *         description: Unauthorized delete attempt
 *       404:
 *         description: Trip not found
 */
router.delete('/:id', protect, deleteTrip);

/**
 * @openapi
 * /trips/{id}/share:
 *   post:
 *     summary: Toggle public visibility and generate/refresh share link
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_public:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Updated public share status and share_token URL
 *       403:
 *         description: Unauthorized share attempt
 */
router.post('/:id/share', protect, shareTrip);

/**
 * @openapi
 * /trips/{id}/copy:
 *   post:
 *     summary: Clone a public/shared trip into user's account
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Trip cloned successfully into user's account
 *       403:
 *         description: Cannot copy private trip
 *       404:
 *         description: Source trip not found
 */
router.post('/:id/copy', protect, copyTrip);

module.exports = router;
