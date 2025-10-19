const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const panenService = require('../services/panen.service');
const lahanService = require('../services/lahan.service');
const { Lahan } = require('../models');

const createPanen = catchAsync(async (req, res) => {
  // Verify that the lahan belongs to the user
  await lahanService.getLahanById(req.body.lahan_id, req.user.id);

  const panen = await panenService.createPanen(req.body);
  res.status(httpStatus.CREATED).send(panen);
});

const getPanens = catchAsync(async (req, res) => {
  // For regular users, only show their panens
  const filter = {};
  if (req.user.role === 'petani') {
    // For petani, we need to find all lahan that belong to them first
    const userLahanIds = await Lahan.findAll({
      where: { user_id: req.user.id },
      attributes: ['id'],
      raw: true,
    }).then((lahans) => lahans.map((l) => l.id));

    filter.lahan_id = userLahanIds;
  }

  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };

  const result = await panenService.queryPanen(filter, options);
  res.send(result);
});

const getAllPanens = catchAsync(async (req, res) => {
  // Only for admin
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const filter = {};
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };

  const result = await panenService.queryPanen(filter, options);
  res.send(result);
});

const getPanen = catchAsync(async (req, res) => {
  const panen = await panenService.getPanenById(req.params.panenId);
  res.send(panen);
});

const updatePanen = catchAsync(async (req, res) => {
  // Verify that the lahan belongs to the user
  const panen = await panenService.getPanenById(req.params.panenId);
  await lahanService.getLahanById(panen.lahan_id, req.user.id);

  const updatedPanen = await panenService.updatePanenById(req.params.panenId, req.body);
  res.send(updatedPanen);
});

const deletePanen = catchAsync(async (req, res) => {
  // Verify that the lahan belongs to the user
  const panen = await panenService.getPanenById(req.params.panenId);
  await lahanService.getLahanById(panen.lahan_id, req.user.id);

  await panenService.deletePanenById(req.params.panenId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getHarvestStats = catchAsync(async (req, res) => {
  // Only for admin
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const { kecamatan } = req.query;
  const stats = await panenService.getHarvestStatistics(kecamatan);
  res.send(stats);
});

const getHarvestTrend = catchAsync(async (req, res) => {
  const { lahanId } = req.params;

  // Check if user owns this lahan
  await lahanService.getLahanById(lahanId, req.user.id);

  const trends = await panenService.getHarvestTrendByLahan(lahanId);
  res.send(trends);
});

module.exports = {
  createPanen,
  getPanens,
  getAllPanens,
  getPanen,
  updatePanen,
  deletePanen,
  getHarvestStats,
  getHarvestTrend,
};
