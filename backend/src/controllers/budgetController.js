const budgetService = require('../services/budgetService');

class BudgetController {
  /**
   * Fetch aggregated budget analytics & expense list
   * GET /api/trips/:id/budget
   */
  async getBudgetAnalytics(req, res, next) {
    try {
      const userId = req.user?.id;
      const tripId = req.params.id;

      const analytics = await budgetService.getBudgetAnalytics(tripId, userId);
      return res.json({
        success: true,
        message: 'Budget analytics retrieved successfully.',
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log a new expense under a trip
   * POST /api/trips/:id/expenses
   */
  async logExpense(req, res, next) {
    try {
      const userId = req.user.id;
      const tripId = req.params.id;
      const { category, amount, expense_date } = req.body;

      if (!category || amount === undefined || !expense_date) {
        return res.status(400).json({
          success: false,
          message: 'category, amount, and expense_date (DD/MM/YYYY) are required.'
        });
      }

      const newExpense = await budgetService.logExpense(tripId, userId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Expense logged successfully.',
        data: newExpense
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a logged expense
   * PUT /api/expenses/:id
   */
  async updateExpense(req, res, next) {
    try {
      const userId = req.user.id;
      const expenseId = req.params.id;

      const updatedExpense = await budgetService.updateExpense(expenseId, userId, req.body);
      if (!updatedExpense) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found.'
        });
      }

      return res.json({
        success: true,
        message: 'Expense updated successfully.',
        data: updatedExpense
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an expense
   * DELETE /api/expenses/:id
   */
  async deleteExpense(req, res, next) {
    try {
      const userId = req.user.id;
      const expenseId = req.params.id;

      const deleted = await budgetService.deleteExpense(expenseId, userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found.'
        });
      }

      return res.json({
        success: true,
        message: 'Expense deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BudgetController();
