const Joi = require('joi');

const createPanen = {
  body: Joi.object().keys({
    lahan_id: Joi.number().integer().required(),
    tanggal_panen: Joi.date().required(),
    jumlah_panen: Joi.number().min(0.01).required(),
    kualitas: Joi.string().valid('baik', 'sedang', 'kurang').optional(),
    harga_jual: Joi.number().min(0).optional(),
    catatan: Joi.string().optional(),
    foto_panen: Joi.string().optional(),
  }),
};

const updatePanen = {
  body: Joi.object().keys({
    lahan_id: Joi.number().integer(),
    tanggal_panen: Joi.date(),
    jumlah_panen: Joi.number().min(0.01),
    kualitas: Joi.string().valid('baik', 'sedang', 'kurang'),
    harga_jual: Joi.number().min(0),
    catatan: Joi.string(),
    foto_panen: Joi.string(),
  }),
};

module.exports = {
  createPanen,
  updatePanen,
};
