const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const panenController = require('../../controllers/panen.controller');
const panenValidation = require('../../validations/panen.validation'); // Akan dibuat nanti

const router = express.Router();

router
  .route('/')
  .post(auth('petani'), validate(panenValidation.createPanen), panenController.createPanen)
  .get(auth('petani', 'admin'), panenController.getPanens);

// Admin specific route
router.route('/all').get(auth('admin'), panenController.getAllPanens);

router.route('/statistik').get(auth('admin'), panenController.getHarvestStats);

router.route('/trend/:lahanId').get(auth('petani', 'admin'), panenController.getHarvestTrend);

router
  .route('/:panenId')
  .get(auth('petani', 'admin'), panenController.getPanen)
  .patch(auth('petani'), validate(panenValidation.updatePanen), panenController.updatePanen)
  .delete(auth('petani'), panenController.deletePanen);

module.exports = router;
