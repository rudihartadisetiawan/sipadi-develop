const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Panen = sequelize.define(
  'Panen',
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
    tanggal_panen: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    jumlah_panen: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01, // Minimal hasil panen > 0
      },
    },
    kualitas: {
      type: DataTypes.STRING(20),
      validate: {
        isIn: [['baik', 'sedang', 'kurang']],
      },
    },
    harga_jual: {
      type: DataTypes.DECIMAL(12, 2),
    },
    catatan: {
      type: DataTypes.TEXT,
    },
    foto_panen: {
      type: DataTypes.STRING(255),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'panen',
    timestamps: false, // Kita handle created_at sendiri
    underscored: true,
  }
);

// Definisikan asosiasi
Panen.associate = (models) => {
  Panen.belongsTo(models.Lahan, { foreignKey: 'lahan_id', as: 'lahan' });
};

module.exports = Panen;
