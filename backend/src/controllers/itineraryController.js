const itineraryService = require('../services/itineraryService');

class ItineraryController {
  /**
   * Schedule a new activity under a trip stop
   * POST /api/itinerary-activities
   */
  async addActivity(req, res, next) {
    try {
      const userId = req.user.id;
      const { trip_stop_id, custom_title, scheduled_date } = req.body;

      if (!trip_stop_id || !custom_title || !scheduled_date) {
        return res.status(400).json({
          success: false,
          message: 'trip_stop_id, custom_title, and scheduled_date (DD/MM/YYYY) are required.'
        });
      }

      const newActivity = await itineraryService.addActivity(userId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Activity scheduled successfully.',
        data: newActivity
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a scheduled activity
   * PUT /api/itinerary-activities/:id
   */
  async updateActivity(req, res, next) {
    try {
      const userId = req.user.id;
      const activityId = req.params.id;

      const updatedActivity = await itineraryService.updateActivity(activityId, userId, req.body);
      if (!updatedActivity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found.'
        });
      }

      return res.json({
        success: true,
        message: 'Activity updated successfully.',
        data: updatedActivity
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a scheduled activity
   * DELETE /api/itinerary-activities/:id
   */
  async deleteActivity(req, res, next) {
    try {
      const userId = req.user.id;
      const activityId = req.params.id;

      const deleted = await itineraryService.deleteActivity(activityId, userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found.'
        });
      }

      return res.json({
        success: true,
        message: 'Activity removed successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder activities sequence
   * PATCH /api/itinerary-activities/reorder
   */
  async reorderActivities(req, res, next) {
    try {
      const userId = req.user.id;
      const { trip_stop_id, activities } = req.body;

      if (!trip_stop_id || !Array.isArray(activities)) {
        return res.status(400).json({
          success: false,
          message: 'trip_stop_id and activities array are required.'
        });
      }

      const reorderedStops = await itineraryService.reorderActivities(trip_stop_id, userId, activities);
      return res.json({
        success: true,
        message: 'Activities reordered successfully.',
        data: reorderedStops
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ItineraryController();
