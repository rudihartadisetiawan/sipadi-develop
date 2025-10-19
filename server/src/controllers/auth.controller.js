const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const tokens = await authService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).send({
    user: {
      id: user.id,
      nik: user.nik,
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
    tokens,
  });
});

const login = catchAsync(async (req, res) => {
  const { nik, password } = req.body;
  const user = await authService.loginUserWithNIK(nik, password);
  const tokens = await authService.generateAuthTokens(user);

  res.send({
    user: {
      id: user.id,
      nik: user.nik,
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
    tokens,
  });
});

const logout = catchAsync(async (req, res) => {
  // For stateless JWT, logout is just client-side token removal
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
};
