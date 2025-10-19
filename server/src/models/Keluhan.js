const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Keluhan = sequelize.define(
  'Keluhan',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lahan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lahan',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['irigasi', 'hama', 'pupuk', 'penyakit', 'lainnya']],
      },
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    foto_bukti: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('foto_bukti');
        try {
          return value ? JSON.parse(value) : [];
        } catch (e) {
          // If parsing fails, return an empty array or handle error
          return [];
        }
      },
      set(value) {
        this.setDataValue('foto_bukti', JSON.stringify(value));
      },
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'diproses', 'selesai']],
      },
    },
    tanggapan: {
      type: DataTypes.TEXT,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    tanggal_keluhan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    tanggal_selesai: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'keluhan',
    timestamps: false, // Kita handle tanggal_keluhan dan tanggal_selesai sendiri
    underscored: true,
  }
);

// Definisikan asosiasi
Keluhan.associate = (models) => {
  Keluhan.belongsTo(models.Lahan, { foreignKey: 'lahan_id', as: 'lahan' });
  Keluhan.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // Petani yang membuat keluhan
  Keluhan.belongsTo(models.User, { foreignKey: 'admin_id', as: 'admin' }); // Admin yang menanggapi
};

module.exports = Keluhan;
