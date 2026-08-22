const stopsService = require('../services/stopsService');

/**
 * POST /api/trips/:id/stops
 * Add a city stop to a trip
 */
const addStop = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;
    const { city_name, arrival_date, departure_date } = req.body;

    if (!city_name || !arrival_date || !departure_date) {
      return res.status(400).json({
        success: false,
        error: 'city_name, arrival_date, and departure_date are required'
      });
    }

    const stop = await stopsService.addStop(tripId, userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Trip stop added successfully',
      data: stop
    });
  } catch (error) {
    console.error('Error in addStop controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * PUT /api/stops/:id
 * Edit stop dates and details
 */
const updateStop = async (req, res) => {
  try {
    const stopId = req.params.id;
    const userId = req.user.id;

    const updatedStop = await stopsService.updateStop(stopId, userId, req.body);
    if (!updatedStop) {
      return res.status(404).json({ success: false, error: 'Trip stop not found' });
    }

    res.json({
      success: true,
      message: 'Trip stop updated successfully',
      data: updatedStop
    });
  } catch (error) {
    console.error('Error in updateStop controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/stops/:id
 * Remove stop from trip
 */
const deleteStop = async (req, res) => {
  try {
    const stopId = req.params.id;
    const userId = req.user.id;

    const deleted = await stopsService.deleteStop(stopId, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Trip stop not found' });
    }

    res.json({
      success: true,
      message: 'Trip stop deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteStop controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

/**
 * PATCH /api/trips/:id/stops/reorder
 * Reorder city stops for a trip
 */
const reorderStops = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;
    const { stops } = req.body;

    if (!Array.isArray(stops)) {
      return res.status(400).json({
        success: false,
        error: 'stops must be an array of objects with id and sequence_order'
      });
    }

    const reorderedList = await stopsService.reorderStops(tripId, userId, stops);
    res.json({
      success: true,
      message: 'Trip stops reordered successfully',
      data: reorderedList
    });
  } catch (error) {
    console.error('Error in reorderStops controller:', error);
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addStop,
  updateStop,
  deleteStop,
  reorderStops
};
