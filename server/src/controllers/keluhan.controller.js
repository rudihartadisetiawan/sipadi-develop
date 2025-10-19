const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const keluhanService = require('../services/keluhan.service');
const lahanService = require('../services/lahan.service');
const { Lahan } = require('../models');

const createKeluhan = catchAsync(async (req, res) => {
  // Verify that the lahan belongs to the user
  await lahanService.getLahanById(req.body.lahan_id, req.user.id);

  const keluhan = await keluhanService.createKeluhan({
    ...req.body,
    user_id: req.user.id, // Auto-associate with current user
  });
  res.status(httpStatus.CREATED).send(keluhan);
});

const getKeluhans = catchAsync(async (req, res) => {
  const filter = { ...req.query };
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };

  // For regular users, only show their complaints
  if (req.user.role === 'petani') {
    // For petani, we need to find all lahan that belong to them first
    const userLahanIds = await Lahan.findAll({
      where: { user_id: req.user.id },
      attributes: ['id'],
      raw: true,
    }).then((lahans) => lahans.map((l) => l.id));

    filter.lahan_id = userLahanIds;
  }

  const result = await keluhanService.queryKeluhan(filter, options);
  res.send(result);
});

const getAllKeluhans = catchAsync(async (req, res) => {
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

  const result = await keluhanService.queryKeluhan(filter, options);
  res.send(result);
});

const getKeluhan = catchAsync(async (req, res) => {
  const keluhan = await keluhanService.getKeluhanById(req.params.keluhanId);
  res.send(keluhan);
});

const updateKeluhan = catchAsync(async (req, res) => {
  // Only admin can update complaint status
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Only admin can update complaint status' });
    return;
  }

  const updatedKeluhan = await keluhanService.updateKeluhanById(req.params.keluhanId, req.body);
  res.send(updatedKeluhan);
});

const deleteKeluhan = catchAsync(async (req, res) => {
  await keluhanService.deleteKeluhanById(req.params.keluhanId, req.user.id, req.user.role);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createKeluhan,
  getKeluhans,
  getAllKeluhans,
  getKeluhan,
  updateKeluhan,
  deleteKeluhan,
};
