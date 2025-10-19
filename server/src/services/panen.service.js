const httpStatus = require('http-status');
const { Panen, Lahan, User } = require('../models');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

/**
 * Create a panen report
 * @param {Object} panenBody
 * @returns {Promise<Panen>}
 */
const createPanen = async (panenBody) => {
  // Check if lahan exists and belongs to user
  const lahan = await Lahan.findByPk(panenBody.lahan_id);
  if (!lahan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Lahan not found');
  }

  const panen = await Panen.create(panenBody);
  return panen;
};

/**
 * Query for panen reports
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryPanen = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  // Base query with associations
  const query = {
    where: filter,
    limit,
    offset,
    order: options.sortBy ? [options.sortBy.split(':')] : [['tanggal_panen', 'DESC']],
    include: [
      {
        model: Lahan,
        as: 'lahan',
        attributes: ['id', 'nama_lahan', 'luas', 'jenis_tanaman', 'desa', 'kecamatan'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nik', 'name'],
          },
        ],
      },
    ],
  };

  const result = await Panen.findAndCountAll(query);

  return {
    results: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
    totalResults: result.count,
  };
};

/**
 * Get panen by id
 * @param {number} id
 * @returns {Promise<Panen>}
 */
const getPanenById = async (id) => {
  const panen = await Panen.findByPk(id, {
    include: [
      {
        model: Lahan,
        as: 'lahan',
        attributes: ['id', 'nama_lahan', 'luas', 'jenis_tanaman', 'desa', 'kecamatan'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nik', 'name'],
          },
        ],
      },
    ],
  });

  if (!panen) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Panen report not found');
  }

  return panen;
};

/**
 * Update panen by id
 * @param {number} panenId
 * @param {Object} updateBody
 * @returns {Promise<Panen>}
 */
const updatePanenById = async (panenId, updateBody) => {
  const panen = await getPanenById(panenId);

  Object.assign(panen, updateBody);
  await panen.save();

  return panen;
};

/**
 * Delete panen by id
 * @param {number} panenId
 * @returns {Promise}
 */
const deletePanenById = async (panenId) => {
  const panen = await getPanenById(panenId);
  await panen.destroy();
};

/**
 * Get harvest statistics for admin
 */
const getHarvestStatistics = async (kecamatan = null) => {
  // This would include complex queries for statistics
  // For now, returning a simplified version
  const whereCondition = kecamatan ? { kecamatan } : {};

  const stats = await Panen.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('jumlah_panen')), 'total_panen'],
      [sequelize.fn('AVG', sequelize.col('jumlah_panen')), 'rata_rata_panen'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'jumlah_laporan'],
    ],
    include: [
      {
        model: Lahan,
        as: 'lahan',
        where: whereCondition,
        attributes: [],
      },
    ],
    raw: true,
  });

  return stats;
};

/**
 * Get harvest trend for a specific lahan
 */
const getHarvestTrendByLahan = async (lahanId) => {
  const trends = await Panen.findAll({
    where: { lahan_id: lahanId },
    attributes: ['tanggal_panen', 'jumlah_panen', 'kualitas'],
    order: [['tanggal_panen', 'ASC']],
    raw: true,
  });

  return trends;
};

module.exports = {
  createPanen,
  queryPanen,
  getPanenById,
  updatePanenById,
  deletePanenById,
  getHarvestStatistics,
  getHarvestTrendByLahan,
};
