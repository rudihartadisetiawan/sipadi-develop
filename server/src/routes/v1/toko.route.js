'use strict';
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { tokoController } = require('../../controllers');
const { tokoValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(tokoValidation.createToko), tokoController.createToko)
  .get(tokoController.getTokos);

router
  .route('/:id')
  .get(tokoController.getToko)
  .patch(auth('admin'), validate(tokoValidation.updateToko), tokoController.updateToko)
  .delete(auth('admin'), validate(tokoValidation.deleteToko), tokoController.deleteToko);

module.exports = router;
