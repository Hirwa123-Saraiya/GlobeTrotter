const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Budget & Expenses
 *   description: Expense tracking, spending category breakdown, daily averages, and over-budget intelligence
 */

/**
 * @swagger
 * /trips/{id}/budget:
 *   get:
 *     summary: Fetch aggregated budget analytics & spending breakdown for a trip
 *     tags: [Budget & Expenses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Budget analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 */
router.get('/trips/:id/budget', protect, budgetController.getBudgetAnalytics);

/**
 * @swagger
 * /trips/{id}/expenses:
 *   post:
 *     summary: Log a new expense under a trip (Accepts dates in DD/MM/YYYY format)
 *     tags: [Budget & Expenses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - amount
 *               - expense_date
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Transport, Accommodation, Meals, Activities, Misc]
 *                 example: Transport
 *               amount:
 *                 type: number
 *                 example: 3500.00
 *               description:
 *                 type: string
 *                 example: Train tickets from Mumbai to Goa
 *               expense_date:
 *                 type: string
 *                 description: Date in DD/MM/YYYY format
 *                 example: 02/09/2026
 *     responses:
 *       201:
 *         description: Expense logged successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post('/trips/:id/expenses', protect, budgetController.logExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update a logged expense
 *     tags: [Budget & Expenses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Transport, Accommodation, Meals, Activities, Misc]
 *                 example: Accommodation
 *               amount:
 *                 type: number
 *                 example: 4500.00
 *               description:
 *                 type: string
 *                 example: Resort stay deposit in North Goa
 *               expense_date:
 *                 type: string
 *                 example: 03/09/2026
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       404:
 *         description: Expense not found
 */
router.put('/expenses/:id', protect, budgetController.updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete a logged expense
 *     tags: [Budget & Expenses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete('/expenses/:id', protect, budgetController.deleteExpense);

module.exports = router;
