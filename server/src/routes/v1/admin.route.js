const express = require('express');
const auth = require('../../middlewares/auth');
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

// Admin dashboard routes
router.route('/dashboard').get(auth('admin'), adminController.getAdminDashboard);

// Analytics route
router.route('/analytics').get(auth('admin'), adminController.getAnalytics);

// Harvest statistics routes
router.route('/harvest-stats/region').get(auth('admin'), adminController.getHarvestStatsByRegion);

// Complaints statistics routes
router.route('/complaints-stats/status').get(auth('admin'), adminController.getComplaintsStatsByStatus);

router.route('/complaints-stats/category').get(auth('admin'), adminController.getComplaintsStatsByCategory);

// Map data routes
router.route('/map/lahan').get(auth('admin'), adminController.getLahanForMap);

module.exports = router;
