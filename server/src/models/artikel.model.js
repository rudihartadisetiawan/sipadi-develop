module.exports = (sequelize, DataTypes) => {
  const Artikel = sequelize.define(
    'Artikel',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'admin_id',
      },
      judul: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      konten: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      gambarUtama: {
        type: DataTypes.STRING(255),
        field: 'gambar_utama',
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
    },
    {
      tableName: 'artikel',
      timestamps: true,
      underscored: true,
    }
  );

  Artikel.associate = (models) => {
    Artikel.belongsTo(models.User, {
      foreignKey: 'adminId',
      as: 'admin',
    });

    Artikel.hasMany(models.Komentar, {
      foreignKey: 'artikelId',
      as: 'komentars',
    });
  };

  return Artikel;
};
