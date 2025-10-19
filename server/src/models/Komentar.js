const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Komentar = sequelize.define(
  'Komentar',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    artikel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artikel',
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
    konten: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    parent_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'komentar',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'komentar',
    timestamps: false, // Kita handle created_at sendiri
    underscored: true,
  }
);

// Definisikan asosiasi
Komentar.associate = (models) => {
  Komentar.belongsTo(models.Artikel, { foreignKey: 'artikel_id', as: 'artikel' });
  Komentar.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Komentar.belongsTo(models.Komentar, { foreignKey: 'parent_id', as: 'parent' });
  Komentar.hasMany(models.Komentar, { foreignKey: 'parent_id', as: 'replies' });
};

module.exports = Komentar;
