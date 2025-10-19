const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Token = sequelize.define(
  'Token',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'tokens',
    timestamps: true, // Sequelize will handle createdAt and updatedAt
    createdAt: 'created_at',
    updatedAt: false, // No updated_at field in the tokens table from migration
    underscored: true,
  }
);

module.exports = Token;
