const tripsService = require('../services/tripsService');

/**
 * GET /api/trips
 * List all trips for the authenticated user
 */
const getTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await tripsService.getUserTrips(userId);
    res.json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    console.error('Error in getTrips controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/trips
 * Create a new trip
 */
const createTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, start_date, end_date } = req.body;

    if (!name || !start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Name, start_date, and end_date are required' });
    }

    const trip = await tripsService.createTrip(userId, req.body);
    res.status(201).json({ success: true, message: 'Trip created successfully', data: trip });
  } catch (error) {
    console.error('Error in createTrip controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/trips/:id
 * Fetch detailed trip data (stops, activities, expenses, health score)
 */
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const trip = await tripsService.getTripById(id, userId);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    res.json({ success: true, data: trip });
  } catch (error) {
    console.error('Error in getTripById controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * PUT /api/trips/:id
 * Update trip metadata & budget
 */
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedTrip = await tripsService.updateTrip(id, userId, req.body);
    if (!updatedTrip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip updated successfully', data: updatedTrip });
  } catch (error) {
    console.error('Error in updateTrip controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/trips/:id
 * Delete a trip
 */
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await tripsService.deleteTrip(id, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTrip controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/trips/:id/share
 * Toggle public visibility & generate share link
 */
const shareTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { is_public } = req.body;

    const sharedTrip = await tripsService.shareTrip(id, userId, is_public);
    if (!sharedTrip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    res.json({
      success: true,
      message: sharedTrip.is_public ? 'Trip is now public' : 'Trip is now private',
      data: {
        id: sharedTrip.id,
        is_public: sharedTrip.is_public,
        share_token: sharedTrip.share_token,
        share_url: `/shared/${sharedTrip.share_token}`
      }
    });
  } catch (error) {
    console.error('Error in shareTrip controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/trips/:id/copy
 * Clone a shared trip into user's account
 */
const copyTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const newUserId = req.user.id;

    const clonedTrip = await tripsService.copyTrip(id, newUserId);
    if (!clonedTrip) {
      return res.status(404).json({ success: false, error: 'Source trip not found' });
    }

    res.status(201).json({
      success: true,
      message: 'Trip copied successfully to your account',
      data: clonedTrip
    });
  } catch (error) {
    console.error('Error in copyTrip controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  shareTrip,
  copyTrip
};
