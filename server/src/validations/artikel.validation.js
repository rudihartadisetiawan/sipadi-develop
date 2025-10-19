const Joi = require('joi');

const createArtikel = {
  body: Joi.object().keys({
    judul: Joi.string().min(5).max(200).required(),
    konten: Joi.string().required(),
    gambar_utama: Joi.string().optional(),
    kategori: Joi.string().max(50).optional(),
    published: Joi.boolean().default(true),
  }),
};

const updateArtikel = {
  body: Joi.object().keys({
    judul: Joi.string().min(5).max(200),
    konten: Joi.string(),
    gambar_utama: Joi.string().optional(),
    kategori: Joi.string().max(50),
    published: Joi.boolean(),
  }),
};

const createKomentar = {
  body: Joi.object().keys({
    artikel_id: Joi.number().integer().required(),
    konten: Joi.string().min(1).max(1000).required(),
    parent_id: Joi.number().integer().optional(),
  }),
};

module.exports = {
  createArtikel,
  updateArtikel,
  createKomentar,
};
