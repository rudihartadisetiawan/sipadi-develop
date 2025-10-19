module.exports = (sequelize, DataTypes) => {
  const Lahan = sequelize.define(
    'Lahan',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      namaLahan: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nama_lahan',
      },
      luas: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01, // Luas must be greater than 0
        },
      },
      geometry: {
        type: DataTypes.GEOMETRY('POLYGON', 4326),
        allowNull: false,
      },
      centroid: {
        type: DataTypes.GEOMETRY('POINT', 4326), // For faster spatial queries
      },
      jenisTanaman: {
        type: DataTypes.STRING(50),
        field: 'jenis_tanaman',
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
    },
    {
      tableName: 'lahan',
      timestamps: true,
      underscored: true,
    }
  );

  Lahan.associate = (models) => {
    Lahan.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Lahan.hasMany(models.Panen, {
      foreignKey: 'lahanId',
      as: 'panens',
    });

    Lahan.hasMany(models.Keluhan, {
      foreignKey: 'lahanId',
      as: 'keluhans',
    });
  };

  return Lahan;
};
