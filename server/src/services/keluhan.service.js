const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Keluhan, Lahan, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a keluhan report
 * @param {Object} keluhanBody
 * @returns {Promise<Keluhan>}
 */
const createKeluhan = async (keluhanBody) => {
  // Check if lahan exists and belongs to user
  const lahan = await Lahan.findByPk(keluhanBody.lahan_id);
  if (!lahan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Lahan not found');
  }

  const keluhan = await Keluhan.create(keluhanBody);
  return keluhan;
};

/**
 * Query for keluhan reports
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryKeluhan = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  // Separate filters for Keluhan and Lahan
  const whereKeluhan = {};
  const whereLahan = {};

  // Date filters for Keluhan
  if (filter.startDate && filter.endDate) {
    whereKeluhan.tanggal_keluhan = { [Op.between]: [filter.startDate, filter.endDate] };
  } else if (filter.startDate) {
    whereKeluhan.tanggal_keluhan = { [Op.gte]: filter.startDate };
  } else if (filter.endDate) {
    whereKeluhan.tanggal_keluhan = { [Op.lte]: filter.endDate };
  }

  // Kecamatan filter for Lahan
  if (filter.kecamatan) {
    whereLahan.kecamatan = filter.kecamatan;
  }

  // Lahan ID filter for Petani
  if (filter.lahan_id) {
    whereKeluhan.lahan_id = filter.lahan_id;
  }

  const query = {
    where: whereKeluhan,
    limit,
    offset,
    order: options.sortBy ? [options.sortBy.split(':')] : [['tanggal_keluhan', 'DESC']],
    include: [
      {
        model: Lahan,
        as: 'lahan',
        attributes: ['id', 'nama_lahan', 'desa', 'kecamatan'],
        where: whereLahan,
        required: !!filter.kecamatan, // Make it an INNER JOIN if filtering by kecamatan
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
    ],
  };

  const result = await Keluhan.findAndCountAll(query);

  return {
    results: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
    totalResults: result.count,
  };
};

/**
 * Get keluhan by id
 * @param {number} id
 * @returns {Promise<Keluhan>}
 */
const getKeluhanById = async (id) => {
  const keluhan = await Keluhan.findByPk(id, {
    include: [
      {
        model: Lahan,
        as: 'lahan',
        attributes: ['id', 'nama_lahan', 'desa', 'kecamatan'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nik', 'name'],
          },
        ],
      },
      {
        model: User,
        as: 'admin',
        attributes: ['id', 'name'],
      },
    ],
  });

  if (!keluhan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Keluhan report not found');
  }

  return keluhan;
};

/**
 * Update keluhan by id
 * @param {number} keluhanId
 * @param {Object} updateBody
 * @returns {Promise<Keluhan>}
 */
const updateKeluhanById = async (keluhanId, updateBody) => {
  const keluhan = await getKeluhanById(keluhanId);

  Object.assign(keluhan, updateBody);
  await keluhan.save();

  return keluhan;
};

/**
 * Delete keluhan by id
 * @param {number} keluhanId
 * @returns {Promise}
 */
const deleteKeluhanById = async (keluhanId, userId, userRole) => {
  const keluhan = await getKeluhanById(keluhanId);

  // Check for ownership or admin role
  if (userRole !== 'admin' && keluhan.user_id !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this complaint');
  }

  await keluhan.destroy();
};

module.exports = {
  createKeluhan,
  queryKeluhan,
  getKeluhanById,
  updateKeluhanById,
  deleteKeluhanById,
};
