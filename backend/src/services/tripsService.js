const pool = require('../config/db');
const crypto = require('crypto');
const { formatToDDMMYYYY, parseDDMMYYYYToISO } = require('../utils/dateFormatter');

/**
 * Format trip object dates to DD/MM/YYYY and compute live trip status (planning, ongoing, completed)
 */
function formatTripDates(trip) {
  if (!trip) return null;

  let computedStatus = trip.status || 'planning';
  if (trip.start_date && trip.end_date) {
    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (today < startDate) {
        computedStatus = 'planning';
      } else if (today >= startDate && today <= endDate) {
        computedStatus = 'ongoing';
      } else if (today > endDate) {
        computedStatus = 'completed';
      }
    }
  }

  return {
    ...trip,
    status: computedStatus,
    start_date: formatToDDMMYYYY(trip.start_date),
    end_date: formatToDDMMYYYY(trip.end_date),
    created_at: formatToDDMMYYYY(trip.created_at)
  };
}

/**
 * Format stop object dates to DD/MM/YYYY
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

/**
 * Calculate Trip Health Score (0 - 100)
 */
function calculateTripHealthScore(trip, stops = []) {
  let score = 50; // Base score
  const totalBudget = parseFloat(trip.total_budget || 0);

  if (totalBudget > 0) score += 20;
  if (stops.length > 0) score += 15;
  if (trip.description && trip.description.length > 5) score += 15;

  return Math.min(100, score);
}

class TripsService {
  /**
   * List all trips for a user with stops eager-loaded
   */
  async getUserTrips(userId) {
    const query = `
      SELECT t.*, 
        COUNT(ts.id)::INT AS stop_count,
        0 AS total_spent
      FROM trips t
      LEFT JOIN trip_stops ts ON ts.trip_id = t.id
      WHERE t.user_id = $1::uuid OR t.user_id::text = $1::text
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    const formattedTrips = rows.map(formatTripDates);

    // Eagerly fetch city stops for every trip
    for (let trip of formattedTrips) {
      const stopsRes = await pool.query(
        'SELECT * FROM trip_stops WHERE trip_id = $1 ORDER BY sequence_order ASC, arrival_date ASC',
        [trip.id]
      );
      trip.stops = stopsRes.rows.map(formatStopDates);
    }

    return formattedTrips;
  }

  /**
   * Create a new trip (supports DD/MM/YYYY dates)
   */
  async createTrip(userId, tripData) {
    const { name, description, start_date, end_date, total_budget, vibe, cover_image, status } = tripData;
    const shareToken = crypto.randomBytes(16).toString('hex');
    
    // Parse DD/MM/YYYY dates to ISO for DB insertion
    const isoStartDate = parseDDMMYYYYToISO(start_date);
    const isoEndDate = parseDDMMYYYYToISO(end_date);

    const query = `
      INSERT INTO trips (user_id, name, description, start_date, end_date, total_budget, vibe, cover_image, status, share_token)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      userId,
      name,
      description || '',
      isoStartDate,
      isoEndDate,
      total_budget || 0.00,
      vibe || 'Balanced',
      cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      status || 'planning',
      shareToken
    ];

    const { rows } = await pool.query(query, values);
    return formatTripDates(rows[0]);
  }

  /**
   * Fetch trip details with stops, itinerary activities, and health score
   */
  async getTripById(tripId, userId) {
    const tripRes = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    if (tripRes.rows.length === 0) {
      return null;
    }
    const rawTrip = tripRes.rows[0];

    // Ownership or Public Access check
    if (!rawTrip.is_public && String(rawTrip.user_id) !== String(userId)) {
      const error = new Error('Unauthorized access to private trip');
      error.status = 403;
      throw error;
    }

    // Fetch stops
    const stopsRes = await pool.query(
      'SELECT * FROM trip_stops WHERE trip_id = $1 ORDER BY sequence_order ASC, arrival_date ASC',
      [tripId]
    );

    // Fetch itinerary activities for each stop
    const stops = [];
    for (let rawStop of stopsRes.rows) {
      const activitiesRes = await pool.query(
        'SELECT * FROM itinerary_activities WHERE trip_stop_id = $1 ORDER BY sequence_order ASC, scheduled_date ASC',
        [rawStop.id]
      );
      const formattedStop = formatStopDates(rawStop);
      formattedStop.activities = activitiesRes.rows.map(formatActivityDates);
      stops.push(formattedStop);
    }

    const formattedTrip = formatTripDates(rawTrip);
    const healthScore = calculateTripHealthScore(formattedTrip, stops);

    return {
      ...formattedTrip,
      stops,
      health_score: healthScore
    };
  }

  /**
   * Update trip (supports DD/MM/YYYY dates)
   */
  async updateTrip(tripId, userId, updateData) {
    const checkRes = await pool.query('SELECT user_id FROM trips WHERE id = $1', [tripId]);
    if (checkRes.rows.length === 0) {
      return null;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to edit this trip');
      error.status = 403;
      throw error;
    }

    const { name, description, start_date, end_date, total_budget, vibe, cover_image, status } = updateData;
    const isoStartDate = start_date ? parseDDMMYYYYToISO(start_date) : null;
    const isoEndDate = end_date ? parseDDMMYYYYToISO(end_date) : null;

    const query = `
      UPDATE trips
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          start_date = COALESCE($3, start_date),
          end_date = COALESCE($4, end_date),
          total_budget = COALESCE($5, total_budget),
          vibe = COALESCE($6, vibe),
          cover_image = COALESCE($7, cover_image),
          status = COALESCE($8, status)
      WHERE id = $9
      RETURNING *
    `;
    const values = [name, description, isoStartDate, isoEndDate, total_budget, vibe, cover_image, status, tripId];
    const { rows } = await pool.query(query, values);
    return formatTripDates(rows[0]);
  }

  /**
   * Delete trip
   */
  async deleteTrip(tripId, userId) {
    const checkRes = await pool.query('SELECT user_id FROM trips WHERE id = $1', [tripId]);
    if (checkRes.rows.length === 0) {
      return false;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to delete this trip');
      error.status = 403;
      throw error;
    }

    await pool.query('DELETE FROM trips WHERE id = $1', [tripId]);
    return true;
  }

  /**
   * Toggle public share status
   */
  async shareTrip(tripId, userId, isPublic) {
    const checkRes = await pool.query('SELECT user_id, share_token FROM trips WHERE id = $1', [tripId]);
    if (checkRes.rows.length === 0) {
      return null;
    }
    if (String(checkRes.rows[0].user_id) !== String(userId)) {
      const error = new Error('Not authorized to share this trip');
      error.status = 403;
      throw error;
    }

    let shareToken = checkRes.rows[0].share_token;
    if (!shareToken) {
      shareToken = crypto.randomBytes(16).toString('hex');
    }

    const targetPublicState = isPublic !== undefined ? Boolean(isPublic) : true;

    const query = `
      UPDATE trips
      SET is_public = $1,
          share_token = $2
      WHERE id = $3
      RETURNING id, name, is_public, share_token
    `;
    const { rows } = await pool.query(query, [targetPublicState, shareToken, tripId]);
    return rows[0];
  }

  /**
   * Clone / Copy trip
   */
  async copyTrip(tripId, newUserId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const origTripRes = await client.query('SELECT * FROM trips WHERE id = $1', [tripId]);
      if (origTripRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      const origTrip = origTripRes.rows[0];

      if (!origTrip.is_public && String(origTrip.user_id) !== String(newUserId)) {
        await client.query('ROLLBACK');
        const error = new Error('Cannot copy private trip');
        error.status = 403;
        throw error;
      }

      const newShareToken = crypto.randomBytes(16).toString('hex');
      const newTripQuery = `
        INSERT INTO trips (user_id, name, description, cover_image, start_date, end_date, total_budget, vibe, status, is_public, share_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'planning', false, $9)
        RETURNING *
      `;
      const newTripValues = [
        newUserId,
        `Copy of ${origTrip.name}`,
        origTrip.description,
        origTrip.cover_image,
        origTrip.start_date,
        origTrip.end_date,
        origTrip.total_budget,
        origTrip.vibe,
        newShareToken
      ];
      const newTripRes = await client.query(newTripQuery, newTripValues);
      const newTrip = newTripRes.rows[0];

      const origStopsRes = await client.query('SELECT * FROM trip_stops WHERE trip_id = $1 ORDER BY sequence_order ASC', [tripId]);
      for (let origStop of origStopsRes.rows) {
        const newStopRes = await client.query(
          `INSERT INTO trip_stops (trip_id, city_name, arrival_date, departure_date, sequence_order)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [newTrip.id, origStop.city_name, origStop.arrival_date, origStop.departure_date, origStop.sequence_order]
        );
        const newStopId = newStopRes.rows[0].id;

        const origActivitiesRes = await client.query(
          'SELECT * FROM itinerary_activities WHERE trip_stop_id = $1 ORDER BY sequence_order ASC',
          [origStop.id]
        );
        for (let origAct of origActivitiesRes.rows) {
          await client.query(
            `INSERT INTO itinerary_activities (trip_stop_id, custom_title, category, scheduled_date, start_time, end_time, custom_cost, notes, sequence_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [newStopId, origAct.custom_title, origAct.category, origAct.scheduled_date, origAct.start_time, origAct.end_time, origAct.custom_cost, origAct.notes, origAct.sequence_order]
          );
        }
      }

      await client.query('COMMIT');
      return formatTripDates(newTrip);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new TripsService();
