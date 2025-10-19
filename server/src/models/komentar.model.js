module.exports = (sequelize, DataTypes) => {
  const Komentar = sequelize.define(
    'Komentar',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artikelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'artikel_id',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      konten: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        field: 'parent_id',
      },
    },
    {
      tableName: 'komentar',
      timestamps: true,
      underscored: true,
    }
  );

  Komentar.associate = (models) => {
    Komentar.belongsTo(models.Artikel, {
      foreignKey: 'artikelId',
      as: 'artikel',
    });

    Komentar.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Komentar.belongsTo(models.Komentar, {
      foreignKey: 'parentId',
      as: 'parent',
    });

    Komentar.hasMany(models.Komentar, {
      foreignKey: 'parentId',
      as: 'children',
    });
  };

  return Komentar;
};
