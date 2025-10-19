const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback =
  (req, resolve, reject, requiredRights, optional = false) =>
  async (err, user, info) => {
    if (err || info || !user) {
      if (optional) {
        req.user = null; // Set user as null instead of rejecting
        return resolve();
      }
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = user.role; // In this case, we're using role as the access control
      const hasRequiredRights =
        requiredRights.includes(userRights) || (requiredRights.includes('petani') && userRights === 'admin');

      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const auth =
  (...args) =>
  async (req, res, next) => {
    // Check if last argument is 'optional' flag
    let requiredRights = args;
    let optional = false;

    if (args.length > 0 && args[args.length - 1] === 'optional') {
      requiredRights = args.slice(0, -1);
      optional = true;
    }

    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights, optional))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
