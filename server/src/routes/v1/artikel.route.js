const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const artikelController = require('../../controllers/artikel.controller');
const komentarController = require('../../controllers/komentar.controller');
const artikelValidation = require('../../validations/artikel.validation'); // Akan dibuat nanti

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(artikelValidation.createArtikel), artikelController.createArtikel)
  .get(auth('optional'), artikelController.getArtikels);

router
  .route('/:artikelId')
  .get(auth('optional'), artikelController.getArtikel)
  .patch(auth('admin'), validate(artikelValidation.updateArtikel), artikelController.updateArtikel)
  .put(auth('admin'), validate(artikelValidation.updateArtikel), artikelController.updateArtikel)
  .delete(auth('admin'), artikelController.deleteArtikel);

// Comments for articles
router
  .route('/:artikelId/komentar')
  .post(auth('petani', 'admin'), validate(artikelValidation.createKomentar), komentarController.createKomentar)
  .get(komentarController.getKomentars);

module.exports = router;
