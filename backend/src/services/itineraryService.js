const pool = require('../config/db');
const { formatToDDMMYYYY, parseDDMMYYYYToISO } = require('../utils/dateFormatter');

/**
 * Format activity object dates to DD/MM/YYYY
 */
function formatActivityDates(activity) {
  if (!activity) return null;
  return {
    ...activity,
    scheduled_date: formatToDDMMYYYY(activity.scheduled_date),
    created_at: formatToDDMMYYYY(activity.created_at)
  };
}

class ItineraryService {
  /**
   * Schedule a new activity for a trip stop
   * POST /api/itinerary-activities
   */
  async addActivity(userId, activityData) {
    const { 
      trip_stop_id, 
      custom_title, 
      category, 
      scheduled_date, 
      start_time, 
      end_time, 
      custom_cost, 
      notes, 
      sequence_order 
    } = activityData;

    // Verify ownership via trip_stops -> trips
    const checkQuery = `
      SELECT ts.id, t.user_id 
      FROM trip_stops ts
      JOIN trips t ON ts.trip_id = t.id
      WHERE ts.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [trip_stop_id]);
    if (checkRes.rows.length === 0) {
      const error = new Error('Trip stop not found');
      error.status = 404;
      throw error;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to add activities to this trip stop');
      error.status = 403;
      throw error;
    }

    // Parse DD/MM/YYYY date to ISO YYYY-MM-DD
    const isoScheduledDate = parseDDMMYYYYToISO(scheduled_date);

    // Calculate default sequence order if not provided
    let seq = sequence_order;
    if (seq === undefined || seq === null) {
      const countRes = await pool.query(
        'SELECT COUNT(*)::INT AS count FROM itinerary_activities WHERE trip_stop_id = $1', 
        [trip_stop_id]
      );
      seq = countRes.rows[0].count + 1;
    }

    const query = `
      INSERT INTO itinerary_activities 
        (trip_stop_id, custom_title, category, scheduled_date, start_time, end_time, custom_cost, notes, sequence_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      trip_stop_id,
      custom_title,
      category || 'Sightseeing',
      isoScheduledDate,
      start_time || null,
      end_time || null,
      custom_cost || 0.00,
      notes || '',
      seq
    ];

    const { rows } = await pool.query(query, values);
    return formatActivityDates(rows[0]);
  }

  /**
   * Update a scheduled activity
   * PUT /api/itinerary-activities/:id
   */
  async updateActivity(activityId, userId, updateData) {
    // Verify ownership via itinerary_activities -> trip_stops -> trips
    const checkQuery = `
      SELECT ia.id, t.user_id 
      FROM itinerary_activities ia
      JOIN trip_stops ts ON ia.trip_stop_id = ts.id
      JOIN trips t ON ts.trip_id = t.id
      WHERE ia.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [activityId]);
    if (checkRes.rows.length === 0) {
      return null;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to edit this activity');
      error.status = 403;
      throw error;
    }

    const { 
      custom_title, 
      category, 
      scheduled_date, 
      start_time, 
      end_time, 
      custom_cost, 
      notes, 
      sequence_order 
    } = updateData;

    const isoScheduledDate = scheduled_date ? parseDDMMYYYYToISO(scheduled_date) : null;

    const query = `
      UPDATE itinerary_activities
      SET custom_title = COALESCE($1, custom_title),
          category = COALESCE($2, category),
          scheduled_date = COALESCE($3, scheduled_date),
          start_time = COALESCE($4, start_time),
          end_time = COALESCE($5, end_time),
          custom_cost = COALESCE($6, custom_cost),
          notes = COALESCE($7, notes),
          sequence_order = COALESCE($8, sequence_order)
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      custom_title, 
      category, 
      isoScheduledDate, 
      start_time, 
      end_time, 
      custom_cost, 
      notes, 
      sequence_order, 
      activityId
    ];

    const { rows } = await pool.query(query, values);
    return formatActivityDates(rows[0]);
  }

  /**
   * Delete a scheduled activity
   * DELETE /api/itinerary-activities/:id
   */
  async deleteActivity(activityId, userId) {
    const checkQuery = `
      SELECT ia.id, t.user_id 
      FROM itinerary_activities ia
      JOIN trip_stops ts ON ia.trip_stop_id = ts.id
      JOIN trips t ON ts.trip_id = t.id
      WHERE ia.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [activityId]);
    if (checkRes.rows.length === 0) {
      return false;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to delete this activity');
      error.status = 403;
      throw error;
    }

    await pool.query('DELETE FROM itinerary_activities WHERE id = $1', [activityId]);
    return true;
  }

  /**
   * Reorder activities sequence for a trip stop
   * PATCH /api/itinerary-activities/reorder
   */
  async reorderActivities(tripStopId, userId, activitiesOrder) {
    // Verify ownership via trip_stops -> trips
    const checkQuery = `
      SELECT ts.id, t.user_id 
      FROM trip_stops ts
      JOIN trips t ON ts.trip_id = t.id
      WHERE ts.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [tripStopId]);
    if (checkRes.rows.length === 0) {
      const error = new Error('Trip stop not found');
      error.status = 404;
      throw error;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to reorder activities for this stop');
      error.status = 403;
      throw error;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (let item of activitiesOrder) {
        await client.query(
          'UPDATE itinerary_activities SET sequence_order = $1 WHERE id = $2 AND trip_stop_id = $3',
          [item.sequence_order, item.id, tripStopId]
        );
      }
      await client.query('COMMIT');

      const reorderedRes = await client.query(
        'SELECT * FROM itinerary_activities WHERE trip_stop_id = $1 ORDER BY sequence_order ASC',
        [tripStopId]
      );
      return reorderedRes.rows.map(formatActivityDates);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ItineraryService();
