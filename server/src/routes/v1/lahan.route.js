const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const lahanController = require('../../controllers/lahan.controller');
const lahanValidation = require('../../validations/lahan.validation'); // Akan dibuat nanti

const router = express.Router();

router
  .route('/')
  .post(auth('petani'), validate(lahanValidation.createLahan), lahanController.createLahan)
  .get(auth('petani', 'admin'), lahanController.getLahans);

// Admin specific route
router.route('/all').get(auth('admin'), lahanController.getAllLahans);

router.route('/check-overlap').post(auth('petani'), validate(lahanValidation.checkOverlap), lahanController.checkOverlap);

router
  .route('/:lahanId')
  .get(auth('petani', 'admin'), lahanController.getLahan)
  .patch(auth('petani'), validate(lahanValidation.updateLahan), lahanController.updateLahan)
  .delete(auth('petani'), lahanController.deleteLahan);

module.exports = router;
