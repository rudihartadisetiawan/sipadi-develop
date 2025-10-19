const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { Lahan, Panen, Keluhan, User, Artikel } = require('../models');

/**
 * Get admin dashboard summary
 */
const getAdminDashboardSummary = async (filters = {}) => {
  const { kecamatan } = filters;
  const whereLahan = {};
  if (kecamatan) {
    whereLahan.kecamatan = kecamatan;
  }

  const totalLahan = await Lahan.count({ where: whereLahan });

  // If filtering by kecamatan, count distinct users who have lahan in that kecamatan
  let totalPetani;
  if (kecamatan) {
    totalPetani = await Lahan.count({
      where: whereLahan,
      distinct: true,
      col: 'user_id',
    });
  } else {
    totalPetani = await User.count({ where: { role: 'petani' } });
  }

  // These stats remain system-wide totals
  const totalPanen = await Panen.count();
  const totalKeluhan = await Keluhan.count();
  const totalArtikel = await Artikel.count();

  const recentKeluhan = await Keluhan.findAll({
    order: [['tanggal_keluhan', 'DESC']],
    limit: 5,
    include: [
      {
        model: Lahan,
        as: 'lahan',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
        attributes: ['id', 'nama_lahan'],
      },
    ],
  });

  const recentArtikel = await Artikel.findAll({
    order: [['created_at', 'DESC']],
    limit: 5,
    include: [
      {
        model: User,
        as: 'admin',
        attributes: ['id', 'name'],
      },
    ],
  });

  return {
    totalLahan,
    totalPetani,
    totalPanen,
    totalKeluhan,
    totalArtikel,
    recentKeluhan,
    recentArtikel,
  };
};

/**
 * Get harvest statistics by region (kecamatan)
 */
const getHarvestStatsByRegion = async (filters) => {
  const { startDate, endDate, kecamatan } = filters;
  const replacements = {};
  const whereClauses = [];

  if (startDate) {
    whereClauses.push('p.tanggal_panen >= :startDate');
    replacements.startDate = startDate;
  }
  if (endDate) {
    whereClauses.push('p.tanggal_panen <= :endDate');
    replacements.endDate = endDate;
  }
  if (kecamatan) {
    whereClauses.push('l.kecamatan = :kecamatan');
    replacements.kecamatan = kecamatan;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const stats = await sequelize.query(
    `
    SELECT 
      l.kecamatan,
      COUNT(p.id) as jumlah_laporan,
      SUM(p.jumlah_panen) as total_panen,
      AVG(p.jumlah_panen) as rata_rata_panen
    FROM panen p
    JOIN lahan l ON p.lahan_id = l.id
    ${whereSql}
    GROUP BY l.kecamatan
    ORDER BY total_panen DESC
  `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements,
    }
  );

  return stats;
};

const buildComplaintWhereClause = (filters) => {
  const { startDate, endDate } = filters;
  const where = {};
  if (startDate && endDate) {
    where.tanggal_keluhan = { [Op.between]: [startDate, endDate] };
  } else if (startDate) {
    where.tanggal_keluhan = { [Op.gte]: startDate };
  } else if (endDate) {
    where.tanggal_keluhan = { [Op.lte]: endDate };
  }
  return where;
};

/**
 * Get complaints statistics by status
 */
const getComplaintsStatsByStatus = async (filters = {}) => {
  const { kecamatan } = filters;
  const whereKeluhan = buildComplaintWhereClause(filters);

  if (kecamatan) {
    const lahanIds = await Lahan.findAll({
      where: { kecamatan },
      attributes: ['id'],
      raw: true,
    }).then((lahans) => lahans.map((l) => l.id));

    if (lahanIds.length === 0) {
      return []; // No lahans match, so no complaints
    }

    whereKeluhan.lahan_id = { [Op.in]: lahanIds };
  }

  const stats = await Keluhan.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    where: whereKeluhan,
    group: ['status'],
    raw: true, // Add raw: true to get plain objects
  });

  // Transform the data to match the chart's expected format ({ name, value })
  const transformedStats = stats.map(item => ({
    name: item.status,
    count: parseInt(item.count, 10),
  }));

  return transformedStats;
};

/**
 * Get complaints statistics by category
 */
const getComplaintsStatsByCategory = async (filters = {}) => {
  const { kecamatan } = filters;
  const whereKeluhan = buildComplaintWhereClause(filters);

  if (kecamatan) {
    const lahanIds = await Lahan.findAll({
      where: { kecamatan },
      attributes: ['id'],
      raw: true,
    }).then((lahans) => lahans.map((l) => l.id));

    if (lahanIds.length === 0) {
      return []; // No lahans match, so no complaints
    }

    whereKeluhan.lahan_id = { [Op.in]: lahanIds };
  }

  const stats = await Keluhan.findAll({
    attributes: ['kategori', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    where: whereKeluhan,
    group: ['kategori'],
  });

  return stats;
};

/**
 * Get lahan data for map visualization
 * This would return geometry data for the interactive map
 */
const getLahanForMap = async (filters = {}) => {
  // In a real implementation with PostGIS, we would use ST_AsGeoJSON or similar
  // For now, returning simplified data
  const whereClause = {};

  if (filters.kecamatan) {
    whereClause.kecamatan = filters.kecamatan;
  }

  if (filters.desa) {
    whereClause.desa = filters.desa;
  }

  const lahan = await Lahan.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      {
        model: Panen,
        as: 'panens',
        attributes: ['id', 'tanggal_panen', 'jumlah_panen'],
        limit: 1,
        order: [['tanggal_panen', 'DESC']],
      },
    ],
    // For map visualization, we would include geometry here
    // But for security reasons, we might want to simplify the geometry or return centroids only
  });

  // Transform data to include simplified location information
  // In a real PostGIS implementation, we would extract coordinates from geometry
  const transformedLahan = lahan.map((item) => ({
    ...item.toJSON(),
    // If geometry data exists in database, we would extract coordinates here
    // For now, we return the data as is, but frontend will need to estimate coordinates
  }));

  return transformedLahan;
};

const getAnalytics = async (filters) => {
  const { year } = filters;

  const harvestTrend = await sequelize.query(
    `
    SELECT
      TO_CHAR(tanggal_panen, 'Mon') as bulan,
      SUM(jumlah_panen) as hasil_panen,
      SUM(l.luas) as luas_panen
    FROM panen p
    JOIN lahan l ON p.lahan_id = l.id
    WHERE EXTRACT(YEAR FROM tanggal_panen) = :year
    GROUP BY TO_CHAR(tanggal_panen, 'Mon'), EXTRACT(MONTH FROM tanggal_panen)
    ORDER BY EXTRACT(MONTH FROM tanggal_panen);
  `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { year },
    }
  );

  const regionalComparison = await sequelize.query(
    `
    SELECT
      l.kecamatan,
      SUM(p.jumlah_panen) as hasil_panen,
      SUM(l.luas) as luas_lahan
    FROM panen p
    JOIN lahan l ON p.lahan_id = l.id
    WHERE EXTRACT(YEAR FROM tanggal_panen) = :year
    GROUP BY l.kecamatan;
  `,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { year },
    }
  );

  const seasonalAnalysis = await sequelize.query(
    `
    SELECT
      CASE
        WHEN EXTRACT(MONTH FROM tanggal_panen) BETWEEN 4 AND 9 THEN 'Kemarau ' || EXTRACT(YEAR FROM tanggal_panen)
        ELSE 'Hujan ' ||
          CASE
            WHEN EXTRACT(MONTH FROM tanggal_panen) >= 10 THEN EXTRACT(YEAR FROM tanggal_panen)
            ELSE EXTRACT(YEAR FROM tanggal_panen) - 1
          END
      END as musim,
      SUM(p.jumlah_panen) as hasil_panen,
      SUM(p.jumlah_panen) / NULLIF(SUM(l.luas), 0) as produktivitas
    FROM panen p
    JOIN lahan l ON p.lahan_id = l.id
    GROUP BY musim
    ORDER BY musim;
  `,
    { type: sequelize.QueryTypes.SELECT }
  );

  return {
    harvestTrend,
    regionalComparison,
    seasonalAnalysis,
  };
};

module.exports = {
  getAdminDashboardSummary,
  getHarvestStatsByRegion,
  getComplaintsStatsByStatus,
  getComplaintsStatsByCategory,
  getLahanForMap,
  getAnalytics,
};
