const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { komentarService, artikelService } = require('../services');

const createKomentar = catchAsync(async (req, res) => {
  // Verify that artikel exists
  await artikelService.getArtikelById(req.body.artikel_id);

  const komentar = await komentarService.createKomentar(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(komentar);
});

const getKomentars = catchAsync(async (req, res) => {
  const filter = { artikel_id: req.params.artikelId };
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };

  const result = await komentarService.queryKomentar(filter, options);
  res.send(result);
});

const getKomentar = catchAsync(async (req, res) => {
  const komentar = await komentarService.getKomentarById(req.params.komentarId);
  res.send(komentar);
});

const updateKomentar = catchAsync(async (req, res) => {
  const updatedKomentar = await komentarService.updateKomentarById(req.params.komentarId, req.body, req.user.id);
  res.send(updatedKomentar);
});

const deleteKomentar = catchAsync(async (req, res) => {
  await komentarService.deleteKomentarById(req.params.komentarId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createKomentar,
  getKomentars,
  getKomentar,
  updateKomentar,
  deleteKomentar,
};
