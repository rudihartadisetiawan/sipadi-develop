const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const artikelService = require('../services/artikel.service');

const createArtikel = catchAsync(async (req, res) => {
  // Only admin can create articles
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Only admin can create articles' });
    return;
  }

  const artikel = await artikelService.createArtikel(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(artikel);
});

const getArtikels = catchAsync(async (req, res) => {
  // Initialize filter object
  const filter = {};
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };

  // For admin users, show all articles (both published and drafts)
  // For unauthenticated users or non-admin users, only show published articles
  if (req.user && req.user.role === 'admin') {
    // Admin can see all articles, no filter by published status
    // Filter object remains empty to show all articles
  } else {
    // Unauthenticated users or non-admin users only see published articles
    filter.published = true;
  }

  const result = await artikelService.queryArtikel(filter, options);
  res.send(result);
});

const getArtikel = catchAsync(async (req, res) => {
  // Ambil artikel dari service
  const artikel = await artikelService.getArtikelById(req.params.artikelId);

  // Jika pengguna bukan admin dan artikel tidak dipublikasikan, tolak akses
  if ((!req.user || req.user.role !== 'admin') && !artikel.published) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'Artikel not found' });
    return;
  }

  res.send(artikel);
});

const updateArtikel = catchAsync(async (req, res) => {
  // Only admin can update articles
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Only admin can update articles' });
    return;
  }

  const updatedArtikel = await artikelService.updateArtikelById(req.params.artikelId, req.body, req.user.id);
  res.send(updatedArtikel);
});

const deleteArtikel = catchAsync(async (req, res) => {
  // Only admin can delete articles
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Only admin can delete articles' });
    return;
  }

  await artikelService.deleteArtikelById(req.params.artikelId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createArtikel,
  getArtikels,
  getArtikel,
  updateArtikel,
  deleteArtikel,
};
