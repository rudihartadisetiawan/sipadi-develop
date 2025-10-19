const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate token
 * @param {number} userId
 * @param {string} expiresIn
 * @returns {string}
 */
const generateToken = (userId, expiresIn) => {
  return jwt.sign({ sub: userId }, config.jwt.secret, {
    expiresIn,
  });
};

module.exports = {
  generateToken,
};
