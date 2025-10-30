'use strict';
const { TokoPertanian } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Create a toko pertanian
 * @param {Object} tokoBody
 * @returns {Promise<TokoPertanian>}
 */
const createToko = async (tokoBody) => {
  return TokoPertanian.create(tokoBody);
};

/**
 * Query for toko pertanian
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryTokos = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  // If status is 'all', remove it from filter to get all records
  if (filter.status && filter.status === 'all') {
    delete filter.status;
  } else if (!filter.status) {
    // Default to only active shops if no status is provided
    filter.status = 'aktif';
  }

  const result = await TokoPertanian.findAndCountAll({
    where: filter,
    limit,
    offset,
    order: options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'DESC']],
  });

  return {
    results: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
    totalResults: result.count,
  };
};

/**
 * Get toko by id
 * @param {number} id
 * @returns {Promise<TokoPertanian>}
 */
const getTokoById = async (id) => {
  const toko = await TokoPertanian.findByPk(id);
  if (!toko) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Toko Pertanian not found');
  }
  return toko;
};

/**
 * Update toko by id
 * @param {number} id
 * @param {Object} updateBody
 * @returns {Promise<TokoPertanian>}
 */
const updateTokoById = async (id, updateBody) => {
  // First, ensure the record exists
  const toko = await getTokoById(id);

  // Perform a static update which is sometimes more reliable for complex types
  await TokoPertanian.update(updateBody, {
    where: { id: id },
  });

  // Re-fetch the instance to get the updated data, since .update doesn't always return it
  const updatedToko = await getTokoById(id);
  return updatedToko;
};

/**
 * Delete toko by id
 * @param {number} id
 * @returns {Promise<TokoPertanian>}
 */
const deleteTokoById = async (id) => {
  const toko = await getTokoById(id);
  await toko.destroy();
  return toko;
};

module.exports = {
  createToko,
  queryTokos,
  getTokoById,
  updateTokoById,
  deleteTokoById,
};
