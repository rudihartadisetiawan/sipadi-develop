const catchAsync = require('../utils/catchAsync');
const { Lahan, Panen, Keluhan, Artikel } = require('../models');
const { sequelize } = require('../config/database');

const getPetaniDashboard = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Get user's lahan count
  const lahanCount = await Lahan.count({
    where: { user_id: userId },
  });

  // Get all user's lahan IDs
  const userLahanIds = await Lahan.findAll({
    where: { user_id: userId },
    attributes: ['id'],
    raw: true,
  }).then((lahans) => lahans.map((l) => l.id));

  // Get latest panens
  const latestPanens = await Panen.findAll({
    where: { lahan_id: userLahanIds },
    order: [['tanggal_panen', 'DESC']],
    limit: 5,
    include: [
      {
        model: Lahan,
        as: 'lahan',
        attributes: ['id', 'nama_lahan'],
      },
    ],
  });

  // Get latest keluhans
  const latestKeluhans = await Keluhan.findAll({
    where: { lahan_id: userLahanIds },
    order: [['tanggal_keluhan', 'DESC']],
    limit: 5,
    include: [
      {
        model: Lahan,
        as: 'lahan',
        attributes: ['id', 'nama_lahan'],
      },
    ],
  });

  // Get recent articles
  const recentArticles = await Artikel.findAll({
    where: { published: true },
    order: [['created_at', 'DESC']],
    limit: 5,
    attributes: ['id', 'judul', 'created_at'],
  });

  // Get status summary
  const keluhanStatus = await Keluhan.findAll({
    where: { lahan_id: userLahanIds },
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['status'],
    raw: true,
  });

  const dashboardData = {
    lahan: {
      total: lahanCount,
    },
    panen: {
      latest: latestPanens,
    },
    keluhan: {
      latest: latestKeluhans,
      status: keluhanStatus,
    },
    artikel: {
      recent: recentArticles,
    },
    summary: {
      lahanCount,
      panenCount: latestPanens.length,
      keluhanCount: latestKeluhans.length,
    },
  };

  res.send(dashboardData);
});

module.exports = {
  getPetaniDashboard,
};
