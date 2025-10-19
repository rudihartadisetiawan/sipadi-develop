const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.postgres.database, config.postgres.user, config.postgres.password, {
  host: config.postgres.host,
  port: config.postgres.port,
  dialect: 'postgres',
  dialectOptions: {
    // Enable PostGIS
    application_name: 'sipadi',
  },
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize };
