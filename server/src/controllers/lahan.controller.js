const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { lahanService } = require('../services');

const createLahan = catchAsync(async (req, res) => {
  const lahan = await lahanService.createLahan(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(lahan);
});

const getLahans = catchAsync(async (req, res) => {
  const filter = { user_id: req.user.id };
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
    includeUser: req.user.role === 'admin',
  };

  if (req.user.role === 'admin') {
    delete filter.user_id;
  }

  const result = await lahanService.queryLahan(filter, options);
  res.send(result);
});

const getAllLahans = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const filter = {};
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
    includeUser: true,
  };

  const result = await lahanService.queryLahan(filter, options);
  res.send(result);
});

const getLahan = catchAsync(async (req, res) => {
  const lahan = await lahanService.getLahanById(req.params.lahanId, req.user.id);
  res.send(lahan);
});

const updateLahan = catchAsync(async (req, res) => {
  const lahan = await lahanService.updateLahanById(req.params.lahanId, req.body, req.user.id);
  res.send(lahan);
});

const deleteLahan = catchAsync(async (req, res) => {
  await lahanService.deleteLahanById(req.params.lahanId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const checkOverlap = catchAsync(async (req, res) => {
  const { geometry } = req.body;
  const isOverlap = await lahanService.checkLahanOverlap(geometry, req.user.id);
  res.send({ isOverlap });
});

module.exports = {
  createLahan,
  getLahans,
  getAllLahans,
  getLahan,
  updateLahan,
  deleteLahan,
  checkOverlap,
};
