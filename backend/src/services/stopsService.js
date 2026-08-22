const pool = require('../config/db');
const { formatToDDMMYYYY, parseDDMMYYYYToISO } = require('../utils/dateFormatter');

/**
 * Format stop dates to DD/MM/YYYY
 */
function formatStopDates(stop) {
  if (!stop) return null;
  return {
    ...stop,
    arrival_date: formatToDDMMYYYY(stop.arrival_date),
    departure_date: formatToDDMMYYYY(stop.departure_date),
    created_at: formatToDDMMYYYY(stop.created_at)
  };
}

class StopsService {
  /**
   * Add a city stop to a trip
   * POST /api/trips/:id/stops
   */
  async addStop(tripId, userId, stopData) {
    const { city_name, arrival_date, departure_date, sequence_order } = stopData;

    // Verify trip ownership
    const tripCheck = await pool.query('SELECT user_id FROM trips WHERE id = $1', [tripId]);
    if (tripCheck.rows.length === 0) {
      const error = new Error('Trip not found');
      error.status = 404;
      throw error;
    }
    if (tripCheck.rows[0].user_id !== userId) {
      const error = new Error('Not authorized to add stops to this trip');
      error.status = 403;
      throw error;
    }

    // Parse DD/MM/YYYY to ISO YYYY-MM-DD
    const isoArrival = parseDDMMYYYYToISO(arrival_date);
    const isoDeparture = parseDDMMYYYYToISO(departure_date);

    // Calculate default sequence order if not specified
    let seq = sequence_order;
    if (seq === undefined || seq === null) {
      const countRes = await pool.query('SELECT COUNT(*)::INT AS count FROM trip_stops WHERE trip_id = $1', [tripId]);
      seq = countRes.rows[0].count + 1;
    }

    const query = `
      INSERT INTO trip_stops (trip_id, city_name, arrival_date, departure_date, sequence_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [tripId, city_name, isoArrival, isoDeparture, seq];
    const { rows } = await pool.query(query, values);

    return formatStopDates(rows[0]);
  }

  /**
   * Edit stop dates and city name
   * PUT /api/stops/:id
   */
  async updateStop(stopId, userId, updateData) {
    // Verify ownership via trip
    const checkQuery = `
      SELECT ts.id, t.user_id 
      FROM trip_stops ts
      JOIN trips t ON ts.trip_id = t.id
      WHERE ts.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [stopId]);
    if (checkRes.rows.length === 0) {
      return null;
    }
    if (checkRes.rows[0].user_id !== userId) {
      const error = new Error('Not authorized to edit this stop');
      error.status = 403;
      throw error;
    }

    const { city_name, arrival_date, departure_date, sequence_order } = updateData;
    const isoArrival = arrival_date ? parseDDMMYYYYToISO(arrival_date) : null;
    const isoDeparture = departure_date ? parseDDMMYYYYToISO(departure_date) : null;

    const query = `
      UPDATE trip_stops
      SET city_name = COALESCE($1, city_name),
          arrival_date = COALESCE($2, arrival_date),
          departure_date = COALESCE($3, departure_date),
          sequence_order = COALESCE($4, sequence_order)
      WHERE id = $5
      RETURNING *
    `;
    const values = [city_name, isoArrival, isoDeparture, sequence_order, stopId];
    const { rows } = await pool.query(query, values);

    return formatStopDates(rows[0]);
  }

  /**
   * Delete a stop
   * DELETE /api/stops/:id
   */
  async deleteStop(stopId, userId) {
    const checkQuery = `
      SELECT ts.id, t.user_id 
      FROM trip_stops ts
      JOIN trips t ON ts.trip_id = t.id
      WHERE ts.id = $1
    `;
    const checkRes = await pool.query(checkQuery, [stopId]);
    if (checkRes.rows.length === 0) {
      return false;
    }
    if (checkRes.rows[0].user_id !== userId) {
      const error = new Error('Not authorized to delete this stop');
      error.status = 403;
      throw error;
    }

    await pool.query('DELETE FROM trip_stops WHERE id = $1', [stopId]);
    return true;
  }

  /**
   * Reorder city stops for a trip
   * PATCH /api/trips/:id/stops/reorder
   */
  async reorderStops(tripId, userId, stopsOrder) {
    // Verify trip ownership
    const tripCheck = await pool.query('SELECT user_id FROM trips WHERE id = $1', [tripId]);
    if (tripCheck.rows.length === 0) {
      const error = new Error('Trip not found');
      error.status = 404;
      throw error;
    }
    if (tripCheck.rows[0].user_id !== userId) {
      const error = new Error('Not authorized to reorder stops for this trip');
      error.status = 403;
      throw error;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (let item of stopsOrder) {
        await client.query(
          'UPDATE trip_stops SET sequence_order = $1 WHERE id = $2 AND trip_id = $3',
          [item.sequence_order, item.id, tripId]
        );
      }
      await client.query('COMMIT');

      const reorderedRes = await client.query(
        'SELECT * FROM trip_stops WHERE trip_id = $1 ORDER BY sequence_order ASC',
        [tripId]
      );
      return reorderedRes.rows.map(formatStopDates);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new StopsService();
