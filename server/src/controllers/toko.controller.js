'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tokoService } = require('../services');

const createToko = catchAsync(async (req, res) => {
  const toko = await tokoService.createToko(req.body);
  res.status(httpStatus.CREATED).send(toko);
});

const getTokos = catchAsync(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };
  const result = await tokoService.queryTokos(filter, options);
  res.send(result);
});

const getToko = catchAsync(async (req, res) => {
  const toko = await tokoService.getTokoById(req.params.id);
  res.send(toko);
});

const updateToko = catchAsync(async (req, res) => {
  const toko = await tokoService.updateTokoById(req.params.id, req.body);
  res.send(toko);
});

const deleteToko = catchAsync(async (req, res) => {
  await tokoService.deleteTokoById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createToko,
  getTokos,
  getToko,
  updateToko,
  deleteToko,
};
