const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        trim: true,
      },
      nik: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
        validate: {
          len: [16, 16], // NIK should be exactly 16 characters
          isNumeric: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
          isEmail: true,
        },
      },
      noTelepon: {
        type: DataTypes.STRING(15),
        field: 'no_telepon',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, Infinity],
        },
      },
      role: {
        type: DataTypes.STRING(20),
        defaultValue: 'petani',
        validate: {
          isIn: [['petani', 'admin']],
        },
      },
      alamat: {
        type: DataTypes.TEXT,
      },
      fotoProfil: {
        type: DataTypes.STRING(255),
        field: 'foto_profil',
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeSave: async (user) => {
          if (user.changed('password')) {
            // eslint-disable-next-line no-param-reassign
            user.password = await bcrypt.hash(user.password, 8);
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Lahan, {
      foreignKey: 'userId',
      as: 'lahans',
    });

    User.hasMany(models.Keluhan, {
      foreignKey: 'userId',
      as: 'keluhans',
    });

    User.hasMany(models.Komentar, {
      foreignKey: 'userId',
      as: 'komentars',
    });

    User.hasMany(models.Artikel, {
      foreignKey: 'adminId',
      as: 'artikels',
    });
  };

  User.isEmailTaken = async function (email, excludeUserId) {
    const where = { email };
    if (excludeUserId) {
      where.id = { [sequelize.Op.ne]: excludeUserId };
    }
    const user = await this.findOne({ where });
    return !!user;
  };

  User.prototype.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.paginate = async function (filter, options) {
    const sort = [];
    if (options.sortBy) {
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sort.push([key, order.toUpperCase()]);
      });
    } else {
      sort.push(['createdAt', 'DESC']);
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.findAndCountAll({
      where: filter,
      order: sort,
      limit,
      offset,
    });

    return {
      totalResults: count,
      results: rows,
      totalPages: Math.ceil(count / limit),
      page,
      limit,
    };
  };

  return User;
};
