const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const lahanRoute = require('./lahan.route');
const panenRoute = require('./panen.route');
const keluhanRoute = require('./keluhan.route');
const artikelRoute = require('./artikel.route');
const dashboardRoute = require('./dashboard.route');
const adminRoute = require('./admin.route');
const uploadRoute = require('./upload.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },

  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/lahan',
    route: lahanRoute,
  },
  {
    path: '/panen',
    route: panenRoute,
  },
  {
    path: '/keluhan',
    route: keluhanRoute,
  },
  {
    path: '/artikel',
    route: artikelRoute,
  },
  {
    path: '/uploads',
    route: uploadRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
