const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/tokens');

/**
 * Register a new user (petani)
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const registerUser = async (userBody) => {
  // Check if nik is taken
  const existingUserByNIK = await User.findOne({
    where: { nik: userBody.nik },
  });

  if (existingUserByNIK) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'NIK already taken');
  }

  // Check if email is taken
  if (userBody.email) {
    const existingUserByEmail = await User.findOne({
      where: { email: userBody.email },
    });

    if (existingUserByEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  // Create user with role 'petani' by default
  const user = await User.create({
    nik: userBody.nik,
    name: userBody.nama,
    email: userBody.email,
    no_telepon: userBody.no_telepon,
    password: userBody.password,
    role: 'petani', // Default role for register is petani
    alamat: userBody.alamat,
  });

  return user;
};

/**
 * Login with NIK and password
 * @param {string} nik
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithNIK = async (nik, password) => {
  const user = await User.findOne({ where: { nik } });

  if (!user || !(await user.correctPassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect NIK or password');
  }

  return user;
};

/**
 * Create user tokens (access & refresh tokens)
 * @param {User} user
 * @returns {Object}
 */
const generateAuthTokens = async (user) => {
  const accessToken = generateToken(user.id, '15m');
  const refreshToken = generateToken(user.id, '30d');

  return {
    access: { token: accessToken, expires: new Date(Date.now() + 15 * 60 * 1000) },
    refresh: { token: refreshToken, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  };
};

module.exports = {
  registerUser,
  loginUserWithNIK,
  generateAuthTokens,
};
