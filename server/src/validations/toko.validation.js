'use strict';
const Joi = require('joi');

const createToko = {
  body: Joi.object().keys({
    nama_toko: Joi.string().required(),
    jam_buka: Joi.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null, ''),
    jam_tutup: Joi.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null, ''),
    produk: Joi.string().optional().allow(null, ''),
    status: Joi.string().valid('aktif', 'non-aktif').optional(),
    geometry: Joi.object().keys({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
  }),
};

const updateToko = {
  params: Joi.object().keys({
    id: Joi.number().integer(),
  }),
  body: Joi.object().keys({
    nama_toko: Joi.string(),
    jam_buka: Joi.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null, ''),
    jam_tutup: Joi.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null, ''),
    produk: Joi.string().optional().allow(null, ''),
    status: Joi.string().valid('aktif', 'non-aktif'),
    geometry: Joi.object().keys({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }),
  }).min(1),
};

const deleteToko = {
  params: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createToko,
  updateToko,
  deleteToko,
};
