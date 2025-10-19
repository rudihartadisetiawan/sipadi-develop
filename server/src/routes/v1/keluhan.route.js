const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const keluhanController = require('../../controllers/keluhan.controller');
const keluhanValidation = require('../../validations/keluhan.validation'); // Akan dibuat nanti

const router = express.Router();

router
  .route('/')
  .post(auth('petani'), validate(keluhanValidation.createKeluhan), keluhanController.createKeluhan)
  .get(auth('petani', 'admin'), keluhanController.getKeluhans);

// Admin specific route
router.route('/all').get(auth('admin'), keluhanController.getAllKeluhans);

router
  .route('/:keluhanId')
  .get(auth('petani', 'admin'), keluhanController.getKeluhan)
  .patch(auth('admin'), validate(keluhanValidation.updateKeluhan), keluhanController.updateKeluhan)
  .delete(auth('petani'), keluhanController.deleteKeluhan);

module.exports = router;
