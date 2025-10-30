'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TokoPertanian = sequelize.define(
  'TokoPertanian',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_toko: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jam_buka: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    jam_tutup: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    produk: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'aktif',
      validate: {
        isIn: [['aktif', 'non-aktif']],
      },
    },
    geometry: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: false,
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
    tableName: 'toko_pertanian',
    timestamps: false, // Match other models
    underscored: true,
  }
);

TokoPertanian.associate = (models) => {
  // No associations yet
};

module.exports = TokoPertanian;