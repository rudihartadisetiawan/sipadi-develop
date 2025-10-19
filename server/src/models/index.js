const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Lahan = require('./Lahan');
const Panen = require('./Panen');
const Keluhan = require('./Keluhan');
const Artikel = require('./Artikel');
const Komentar = require('./Komentar');
const Token = require('./Token');

const db = {};

// Assign models to db object
db.User = User;
db.Lahan = Lahan;
db.Panen = Panen;
db.Keluhan = Keluhan;
db.Artikel = Artikel;
db.Komentar = Komentar;
db.Token = Token;

// Define associations using the associate method in each model
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
