const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Artikel = sequelize.define(
  'Artikel',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    judul: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    konten: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gambar_utama: {
      type: DataTypes.STRING(255),
    },
    kategori: {
      type: DataTypes.STRING(50),
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'artikel',
    timestamps: false, // Kita handle sendiri created_at dan updated_at
    underscored: true,
  }
);

// Definisikan asosiasi
Artikel.associate = (models) => {
  Artikel.belongsTo(models.User, { foreignKey: 'admin_id', as: 'admin' });
  Artikel.hasMany(models.Komentar, { foreignKey: 'artikel_id', as: 'komentars' });
};

module.exports = Artikel;
