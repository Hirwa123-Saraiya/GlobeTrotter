const pool = require('../config/db');
const { formatToDDMMYYYY, parseDDMMYYYYToISO } = require('../utils/dateFormatter');

/**
 * Format expense object dates to DD/MM/YYYY
 */
function formatExpenseDates(expense) {
  if (!expense) return null;
  return {
    ...expense,
    amount: parseFloat(expense.amount || 0),
    expense_date: formatToDDMMYYYY(expense.expense_date),
    created_at: formatToDDMMYYYY(expense.created_at)
  };
}

class BudgetService {
  /**
   * Log a new expense under a trip
   * POST /api/trips/:id/expenses
   */
  async logExpense(tripId, userId, expenseData) {
    const { category, amount, description, expense_date } = expenseData;

    // Verify trip ownership
    const checkRes = await pool.query('SELECT user_id FROM trips WHERE id = $1', [tripId]);
    if (checkRes.rows.length === 0) {
      const error = new Error('Trip not found');
      error.status = 404;
      throw error;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to add expenses to this trip');
      error.status = 403;
      throw error;
    }

    const isoExpenseDate = parseDDMMYYYYToISO(expense_date);

    const query = `
      INSERT INTO expenses (trip_id, category, amount, description, expense_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      tripId,
      category || 'Misc',
      parseFloat(amount) || 0.00,
      description || '',
      isoExpenseDate
    ];

    const { rows } = await pool.query(query, values);
    return formatExpenseDates(rows[0]);
  }

  /**
   * Update a logged expense
   * PUT /api/expenses/:id
   */
  async updateExpense(expenseId, userId, updateData) {
    const checkQuery = `
      SELECT e.id, t.user_id 
      FROM expenses e
      JOIN trips t ON e.trip_id = t.id
      WHERE e.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [expenseId]);
    if (checkRes.rows.length === 0) {
      return null;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to edit this expense');
      error.status = 403;
      throw error;
    }

    const { category, amount, description, expense_date } = updateData;
    const isoExpenseDate = expense_date ? parseDDMMYYYYToISO(expense_date) : null;

    const query = `
      UPDATE expenses
      SET category = COALESCE($1, category),
          amount = COALESCE($2, amount),
          description = COALESCE($3, description),
          expense_date = COALESCE($4, expense_date)
      WHERE id = $5
      RETURNING *
    `;
    const values = [category, amount, description, isoExpenseDate, expenseId];
    const { rows } = await pool.query(query, values);
    return formatExpenseDates(rows[0]);
  }

  /**
   * Fetch aggregated budget analytics, category breakdown, daily averages, and expense list
   * GET /api/trips/:id/budget
   */
  async getBudgetAnalytics(tripId, userId) {
    // Verify trip ownership or public status
    const tripRes = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    if (tripRes.rows.length === 0) {
      const error = new Error('Trip not found');
      error.status = 404;
      throw error;
    }
    const trip = tripRes.rows[0];

    if (!trip.is_public && String(trip.user_id) !== String(userId)) {
      const error = new Error('Unauthorized access to private trip budget');
      error.status = 403;
      throw error;
    }

    // Calculate total trip duration in days
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    // Fetch all logged expenses
    const expensesRes = await pool.query(
      'SELECT * FROM expenses WHERE trip_id = $1 ORDER BY expense_date DESC, created_at DESC',
      [tripId]
    );
    const expenses = expensesRes.rows.map(formatExpenseDates);

    // Calculate spending totals
    const totalBudget = parseFloat(trip.total_budget || 0);
    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const remainingBudget = totalBudget - totalSpent;
    const isOverBudget = totalSpent > totalBudget;
    const overBudgetAmount = isOverBudget ? totalSpent - totalBudget : 0;
    const dailyAverage = parseFloat((totalSpent / totalDays).toFixed(2));

    // Category aggregation
    const categoriesList = ['Transport', 'Accommodation', 'Meals', 'Activities', 'Misc'];
    const categoryTotals = {
      Transport: 0,
      Accommodation: 0,
      Meals: 0,
      Activities: 0,
      Misc: 0
    };

    expenses.forEach(e => {
      const cat = e.category || 'Misc';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += parseFloat(e.amount || 0);
      } else {
        categoryTotals['Misc'] += parseFloat(e.amount || 0);
      }
    });

    const categoryBreakdown = categoriesList.map(catName => {
      const amt = categoryTotals[catName] || 0;
      const percentage = totalSpent > 0 ? parseFloat(((amt / totalSpent) * 100).toFixed(1)) : 0;
      return {
        category: catName,
        amount: amt,
        percentage
      };
    });

    return {
      trip_id: trip.id,
      trip_name: trip.name,
      start_date: formatToDDMMYYYY(trip.start_date),
      end_date: formatToDDMMYYYY(trip.end_date),
      total_days: totalDays,
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining_budget: remainingBudget,
      is_over_budget: isOverBudget,
      over_budget_amount: overBudgetAmount,
      daily_average: dailyAverage,
      category_breakdown: categoryBreakdown,
      expenses: expenses
    };
  }

  /**
   * Delete an expense
   * DELETE /api/expenses/:id
   */
  async deleteExpense(expenseId, userId) {
    const checkQuery = `
      SELECT e.id, t.user_id 
      FROM expenses e
      JOIN trips t ON e.trip_id = t.id
      WHERE e.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [expenseId]);
    if (checkRes.rows.length === 0) {
      return false;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to delete this expense');
      error.status = 403;
      throw error;
    }

    await pool.query('DELETE FROM expenses WHERE id = $1', [expenseId]);
    return true;
  }
}

module.exports = new BudgetService();
