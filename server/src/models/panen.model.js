module.exports = (sequelize, DataTypes) => {
  const Panen = sequelize.define(
    'Panen',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lahanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'lahan_id',
      },
      tanggalPanen: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'tanggal_panen',
      },
      jumlahPanen: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'jumlah_panen',
      },
      kualitas: {
        type: DataTypes.STRING(20),
        validate: {
          isIn: [['baik', 'sedang', 'kurang']],
        },
      },
      hargaJual: {
        type: DataTypes.DECIMAL(12, 2),
        field: 'harga_jual',
      },
      catatan: {
        type: DataTypes.TEXT,
      },
      fotoPanen: {
        type: DataTypes.STRING(255),
        field: 'foto_panen',
      },
    },
    {
      tableName: 'panen',
      timestamps: true,
      underscored: true,
    }
  );

  Panen.associate = (models) => {
    Panen.belongsTo(models.Lahan, {
      foreignKey: 'lahanId',
      as: 'lahan',
    });
  };

  return Panen;
};
