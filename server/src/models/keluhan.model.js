module.exports = (sequelize, DataTypes) => {
  const Keluhan = sequelize.define(
    'Keluhan',
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
      fotoBukti: {
        type: DataTypes.STRING(255),
        field: 'foto_bukti',
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
      adminId: {
        type: DataTypes.INTEGER,
        field: 'admin_id',
      },
      tanggalSelesai: {
        type: DataTypes.DATE,
        field: 'tanggal_selesai',
      },
    },
    {
      tableName: 'keluhan',
      timestamps: true,
      underscored: true,
    }
  );

  Keluhan.associate = (models) => {
    Keluhan.belongsTo(models.Lahan, {
      foreignKey: 'lahanId',
      as: 'lahan',
    });

    Keluhan.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Keluhan.belongsTo(models.User, {
      foreignKey: 'adminId',
      as: 'admin',
    });
  };

  return Keluhan;
};
