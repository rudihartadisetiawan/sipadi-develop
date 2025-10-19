const httpStatus = require('http-status');
const { Lahan, User, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a lahan
 * @param {Object} lahanBody
 * @param {number} userId
 * @returns {Promise<Lahan>}
 */
const createLahan = async (lahanBody, userId) => {
  // Verify that user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // Handle geometry separately
  const { geometry, ...otherData } = lahanBody;

  const lahanData = {
    ...otherData,
    user_id: userId,
  };

  if (geometry) {
    lahanData.geometry = sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(geometry));
  }

  const lahan = await Lahan.create(lahanData);

  return lahan;
};

/**
 * Query for lahan
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page
 * @param {number} [options.page] - Current page number
 * @returns {Promise<QueryResult>}
 */
const queryLahan = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  // Base query
  const query = {
    where: filter,
    limit,
    offset,
    order: options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'DESC']],
  };

  // If we want to include user information
  if (options.includeUser) {
    query.include = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nik', 'nama'],
      },
    ];
  }

  const result = await Lahan.findAndCountAll(query);

  return {
    results: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
    totalResults: result.count,
  };
};

/**
 * Get lahan by id
 * @param {number} id
 * @param {number} userId
 * @returns {Promise<Lahan>}
 */
const getLahanById = async (id, userId) => {
  const lahan = await Lahan.findByPk(id);

  if (!lahan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lahan not found');
  }

  // Check if the user owns this lahan (for regular users)
  if (userId && lahan.user_id !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this lahan');
  }

  return lahan;
};

/**
 * Update lahan by id
 * @param {number} lahanId
 * @param {Object} updateBody
 * @param {number} userId
 * @returns {Promise<Lahan>}
 */
const updateLahanById = async (lahanId, updateBody, userId) => {
  const lahan = await getLahanById(lahanId, userId);

  Object.assign(lahan, updateBody);
  await lahan.save();

  return lahan;
};

/**
 * Delete lahan by id
 * @param {number} lahanId
 * @param {number} userId
 * @returns {Promise}
 */
const deleteLahanById = async (lahanId, userId) => {
  const lahan = await getLahanById(lahanId, userId);
  await lahan.destroy();
};

/**
 * Check if lahan geometry overlaps with existing lahan
 * This function is particularly important for PostGIS
 */
const checkLahanOverlap = async () => {
  // This is a simplified version - in real implementation with PostGIS,
  // we would use ST_Intersects or ST_Overlaps functions
  // For now, we'll just return false as a placeholder
  return false;
};

module.exports = {
  createLahan,
  queryLahan,
  getLahanById,
  updateLahanById,
  deleteLahanById,
  checkLahanOverlap,
};
