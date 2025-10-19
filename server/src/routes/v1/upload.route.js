const express = require('express');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');
const uploadController = require('../../controllers/upload.controller');

const router = express.Router();

router.route('/').post(auth(), upload.array('files', 3), uploadController.uploadFile);

module.exports = router;
