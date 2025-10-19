const express = require('express');
const auth = require('../../middlewares/auth');
const dashboardController = require('../../controllers/dashboard.controller');

const router = express.Router();

router.route('/petani').get(auth('petani'), dashboardController.getPetaniDashboard);

module.exports = router;
