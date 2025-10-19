const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nik: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
      validate: {
        len: [16, 16], // NIK harus 16 karakter
        isNumeric: true,
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    no_telepon: {
      type: DataTypes.STRING(15),
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: 'petani',
      validate: {
        isIn: [['petani', 'admin']],
      },
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    foto_profil: {
      type: DataTypes.STRING(255),
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users',
    timestamps: false, // Kita handle sendiri created_at dan updated_at
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          // eslint-disable-next-line no-param-reassign
          user.password_hash = await bcrypt.hash(user.password_hash, 8);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          // eslint-disable-next-line no-param-reassign
          user.password_hash = await bcrypt.hash(user.password_hash, 8);
        }
      },
    },
  }
);

// Method to check password
User.prototype.correctPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Method to hide sensitive fields when converting to JSON
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

// Definisikan asosiasi
User.associate = (models) => {
  User.hasMany(models.Lahan, { foreignKey: 'user_id', as: 'lahans' });
  User.hasMany(models.Keluhan, { foreignKey: 'user_id', as: 'keluhans' });
  User.hasMany(models.Artikel, { foreignKey: 'admin_id', as: 'artikels' });
  User.hasMany(models.Komentar, { foreignKey: 'user_id', as: 'komentars' });
};

module.exports = User;
