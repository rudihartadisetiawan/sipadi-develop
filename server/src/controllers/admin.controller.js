const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const adminService = require('../services/admin.service');

const getAdminDashboard = catchAsync(async (req, res) => {
  // Only admin can access this
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const dashboardData = await adminService.getAdminDashboardSummary(req.query);
  res.send(dashboardData);
});

const getHarvestStatsByRegion = catchAsync(async (req, res) => {
  // Only admin can access this
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const stats = await adminService.getHarvestStatsByRegion(req.query);
  res.send(stats);
});

const getComplaintsStatsByStatus = catchAsync(async (req, res) => {
  // Only admin can access this
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const stats = await adminService.getComplaintsStatsByStatus(req.query);
  res.send(stats);
});

const getComplaintsStatsByCategory = catchAsync(async (req, res) => {
  // Only admin can access this
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const stats = await adminService.getComplaintsStatsByCategory(req.query);
  res.send(stats);
});

const getLahanForMap = catchAsync(async (req, res) => {
  // Only admin can access this
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }

  const filters = {};
  if (req.query.kecamatan) filters.kecamatan = req.query.kecamatan;
  if (req.query.desa) filters.desa = req.query.desa;

  const lahan = await adminService.getLahanForMap(filters);
  res.send(lahan);
});

const getAnalytics = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Admin access required' });
    return;
  }
  const analyticsData = await adminService.getAnalytics(req.query);
  res.send(analyticsData);
});

module.exports = {
  getAdminDashboard,
  getHarvestStatsByRegion,
  getComplaintsStatsByStatus,
  getComplaintsStatsByCategory,
  getLahanForMap,
  getAnalytics,
};
