const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lahan = sequelize.define(
  'Lahan',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    nama_lahan: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    luas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01, // Luas minimal 0.01 hektar
      },
    },
    geometry: {
      type: DataTypes.GEOMETRY('Polygon'), // Tipe PostGIS
      allowNull: false,
    },
    centroid: {
      type: DataTypes.GEOMETRY('Point'), // Tipe PostGIS
    },
    jenis_tanaman: {
      type: DataTypes.STRING(50),
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'aktif',
      validate: {
        isIn: [['aktif', 'bera', 'bermasalah']],
      },
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    desa: {
      type: DataTypes.STRING(50),
    },
    kecamatan: {
      type: DataTypes.STRING(50),
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
    tableName: 'lahan',
    timestamps: false, // Kita handle sendiri created_at dan updated_at
    underscored: true,
  }
);

// Definisikan asosiasi
Lahan.associate = (models) => {
  Lahan.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Lahan.hasMany(models.Panen, { foreignKey: 'lahan_id', as: 'panens' });
  Lahan.hasMany(models.Keluhan, { foreignKey: 'lahan_id', as: 'keluhans' });
};

module.exports = Lahan;
