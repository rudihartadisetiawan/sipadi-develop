const Joi = require('joi');

const createKeluhan = {
  body: Joi.object().keys({
    lahan_id: Joi.number().integer().required(),
    kategori: Joi.string().valid('irigasi', 'hama', 'pupuk', 'penyakit', 'lainnya').required(),
    deskripsi: Joi.string().required(),
    foto_bukti: Joi.array().items(Joi.string().uri()).optional(),
  }),
};

const updateKeluhan = {
  body: Joi.object().keys({
    status: Joi.string().valid('pending', 'diproses', 'selesai').optional(),
    tanggapan: Joi.string().optional(),
    admin_id: Joi.number().integer().optional(),
  }),
};

module.exports = {
  createKeluhan,
  updateKeluhan,
};
