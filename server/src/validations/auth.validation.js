const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    nik: Joi.string()
      .length(16)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': 'NIK must be exactly 16 digits',
        'string.pattern.base': 'NIK must contain only numbers',
      }),
    nama: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().optional(),
    no_telepon: Joi.string().max(15).optional(),
    password: Joi.string().required().custom(password),
    alamat: Joi.string().optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    nik: Joi.string()
      .length(16)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': 'NIK must be exactly 16 digits',
        'string.pattern.base': 'NIK must contain only numbers',
      }),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
};
