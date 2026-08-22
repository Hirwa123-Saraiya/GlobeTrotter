const asyncHandler = require('../utils/asyncHandler');
const citiesService = require('../services/citiesService');
const activitiesService = require('../services/activitiesService');

/**
 * GET /api/cities - Discover global cities catalog
 */
const getCities = asyncHandler(async (req, res) => {
  const { search, region } = req.query;
  const cities = await citiesService.getAllCities(search, region);
  res.status(200).json({
    success: true,
    count: cities.length,
    data: cities
  });
});

/**
 * GET /api/activities - Discover travel activities catalog
 */
const getActivities = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const activities = await activitiesService.getAllActivities(search, category);
  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities
  });
});

module.exports = {
  getCities,
  getActivities
};
