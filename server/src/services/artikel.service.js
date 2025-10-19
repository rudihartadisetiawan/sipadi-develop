const httpStatus = require('http-status');
const { Artikel, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an article
 * @param {Object} artikelBody
 * @param {number} adminId
 * @returns {Promise<Artikel>}
 */
const createArtikel = async (artikelBody, adminId) => {
  // Verify that user is admin
  const user = await User.findByPk(adminId);
  if (!user || user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admin can create articles');
  }

  const artikel = await Artikel.create({
    ...artikelBody,
    admin_id: adminId,
  });

  return artikel;
};

/**
 * Query for articles
 * @param {Object} filter - Sequelize filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryArtikel = async (filter, options) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const query = {
    where: filter,
    limit,
    offset,
    order: options.sortBy ? [options.sortBy.split(':')] : [['created_at', 'DESC']],
    include: [
      {
        model: User,
        as: 'admin',
        attributes: ['id', 'name'],
      },
    ],
  };

  const result = await Artikel.findAndCountAll(query);

  return {
    results: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
    totalResults: result.count,
  };
};

/**
 * Get article by id
 * @param {number} id
 * @returns {Promise<Artikel>}
 */
const getArtikelById = async (id) => {
  const artikel = await Artikel.findByPk(id, {
    include: [
      {
        model: User,
        as: 'admin',
        attributes: ['id', 'name'],
      },
    ],
  });

  if (!artikel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Artikel not found');
  }

  // Increase view count secara aman tanpa mempengaruhi field lain
  await Artikel.update({ views: artikel.views + 1 }, { where: { id } });

  return artikel;
};

/**
 * Update article by id
 * @param {number} artikelId
 * @param {Object} updateBody
 * @param {number} adminId
 * @returns {Promise<Artikel>}
 */
const updateArtikelById = async (artikelId, updateBody, adminId) => {
  const artikel = await getArtikelById(artikelId);

  // Verify that user is admin and owns the article
  const user = await User.findByPk(adminId);
  if (!user || user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admin can update articles');
  }

  Object.assign(artikel, updateBody);

  await artikel.save();

  return artikel;
};

/**
 * Delete article by id
 * @param {number} artikelId
 * @param {number} adminId
 * @returns {Promise}
 */
const deleteArtikelById = async (artikelId, adminId) => {
  const artikel = await getArtikelById(artikelId);

  // Verify that user is admin and owns the article
  const user = await User.findByPk(adminId);
  if (!user || user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admin can delete articles');
  }

  await artikel.destroy();
};

module.exports = {
  createArtikel,
  queryArtikel,
  getArtikelById,
  updateArtikelById,
  deleteArtikelById,
};
