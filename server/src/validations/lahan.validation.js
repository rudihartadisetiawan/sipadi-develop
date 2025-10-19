const Joi = require('joi');

const createLahan = {
  body: Joi.object().keys({
    nama_lahan: Joi.string().min(3).max(100).required(),
    luas: Joi.number().min(0).required(),
    geometry: Joi.object()
      .keys({
        type: Joi.string().valid('Polygon').required(),
        coordinates: Joi.array().required(),
      })
      .optional(),
    jenis_tanaman: Joi.string().max(50).optional(),
    status: Joi.string().valid('aktif', 'bera', 'bermasalah').default('aktif'),
    alamat: Joi.string().optional(),
    desa: Joi.string().max(50).optional(),
    kecamatan: Joi.string().max(50).optional(),
  }),
};

const updateLahan = {
  body: Joi.object().keys({
    nama_lahan: Joi.string().min(3).max(100),
    luas: Joi.number().min(0.01),
    geometry: Joi.object().keys({
      type: Joi.string().valid('Polygon'),
      coordinates: Joi.array(),
    }),
    jenis_tanaman: Joi.string().max(50),
    status: Joi.string().valid('aktif', 'bera', 'bermasalah'),
    alamat: Joi.string(),
    desa: Joi.string().max(50),
    kecamatan: Joi.string().max(50),
  }),
};

const checkOverlap = {
  body: Joi.object().keys({
    geometry: Joi.object()
      .keys({
        type: Joi.string().valid('Polygon').required(),
        coordinates: Joi.array().required(),
      })
      .required(),
  }),
};

module.exports = {
  createLahan,
  updateLahan,
  checkOverlap,
};
