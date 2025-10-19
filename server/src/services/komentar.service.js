const httpStatus = require('http-status');
const { Komentar, Artikel, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a comment
 * @param {Object} komentarBody
 * @param {number} userId
 * @returns {Promise<Komentar>}
 */
const createKomentar = async (komentarBody, userId) => {
  // Verify that artikel exists
  const artikel = await Artikel.findByPk(komentarBody.artikel_id);
  if (!artikel) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Artikel not found');
  }

  const komentar = await Komentar.create({
    ...komentarBody,
    user_id: userId,
  });
  return komentar;
};

/**
 * Query for comments
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryKomentar = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const query = {
    where: filter,
    limit,
    offset,
    order: options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'ASC']], // Comments usually ordered oldest first
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      {
        model: Artikel,
        as: 'artikel',
        attributes: ['id', 'judul'],
      },
    ],
  };

  const result = await Komentar.findAndCountAll(query);

  return {
    results: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
    totalResults: result.count,
  };
};

/**
 * Get comment by id
 * @param {number} id
 * @returns {Promise<Komentar>}
 */
const getKomentarById = async (id) => {
  const komentar = await Komentar.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      {
        model: Artikel,
        as: 'artikel',
        attributes: ['id', 'judul'],
      },
    ],
  });

  if (!komentar) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Komentar not found');
  }

  return komentar;
};

/**
 * Update comment by id
 * @param {number} komentarId
 * @param {Object} updateBody
 * @param {number} userId
 * @returns {Promise<Komentar>}
 */
const updateKomentarById = async (komentarId, updateBody, userId) => {
  const komentar = await getKomentarById(komentarId);

  // Check if user owns the comment or is admin
  const user = await User.findByPk(userId);
  if (komentar.user_id !== userId && user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only comment owner or admin can update comment');
  }

  Object.assign(komentar, updateBody);
  await komentar.save();

  return komentar;
};

/**
 * Delete comment by id
 * @param {number} komentarId
 * @param {number} userId
 * @returns {Promise}
 */
const deleteKomentarById = async (komentarId, userId) => {
  const komentar = await getKomentarById(komentarId);

  // Check if user owns the comment or is admin
  const user = await User.findByPk(userId);
  if (komentar.user_id !== userId && user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only comment owner or admin can delete comment');
  }

  await komentar.destroy();
};

module.exports = {
  createKomentar,
  queryKomentar,
  getKomentarById,
  updateKomentarById,
  deleteKomentarById,
};
