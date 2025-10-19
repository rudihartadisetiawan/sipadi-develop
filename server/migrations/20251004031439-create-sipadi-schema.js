module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Enable PostGIS extension
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');

    // Create Users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nik: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true,
        validate: {
          len: [16, 16], // NIK should be exactly 16 characters
          isNumeric: true,
        },
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        trim: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
          isEmail: true,
        },
      },
      no_telepon: {
        type: Sequelize.STRING(15),
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [8, Infinity],
        },
      },
      role: {
        type: Sequelize.STRING(20),
        defaultValue: 'petani',
        validate: {
          isIn: [['petani', 'admin']],
        },
      },
      alamat: {
        type: Sequelize.TEXT,
      },
      foto_profil: {
        type: Sequelize.STRING(255),
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create Lahan table (with PostGIS geometry)
    await queryInterface.createTable('lahan', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      nama_lahan: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      luas: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01, // Luas must be greater than 0
        },
      },
      geometry: {
        type: 'GEOMETRY(POLYGON, 4326)',
        allowNull: true,
      },
      centroid: {
        type: 'GEOMETRY(POINT, 4326)', // For faster spatial queries
      },
      jenis_tanaman: {
        type: Sequelize.STRING(50),
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'aktif',
        validate: {
          isIn: [['aktif', 'bera', 'bermasalah']],
        },
      },
      alamat: {
        type: Sequelize.TEXT,
      },
      desa: {
        type: Sequelize.STRING(50),
      },
      kecamatan: {
        type: Sequelize.STRING(50),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create Panen table
    await queryInterface.createTable('panen', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      lahan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lahan',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tanggal_panen: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      jumlah_panen: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      kualitas: {
        type: Sequelize.STRING(20),
        validate: {
          isIn: [['baik', 'sedang', 'kurang']],
        },
      },
      harga_jual: {
        type: Sequelize.DECIMAL(12, 2),
      },
      catatan: {
        type: Sequelize.TEXT,
      },
      foto_panen: {
        type: Sequelize.STRING(255),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create Keluhan table
    await queryInterface.createTable('keluhan', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      lahan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lahan',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      kategori: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isIn: [['irigasi', 'hama', 'pupuk', 'penyakit', 'lainnya']],
        },
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      foto_bukti: {
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'diproses', 'selesai']],
        },
      },
      tanggapan: {
        type: Sequelize.TEXT,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      tanggal_keluhan: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      tanggal_selesai: {
        type: Sequelize.DATE,
      },
    });

    // Create Artikel table
    await queryInterface.createTable('artikel', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      judul: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      konten: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gambar_utama: {
        type: Sequelize.STRING(255),
      },
      kategori: {
        type: Sequelize.STRING(50),
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create Komentar table
    await queryInterface.createTable('komentar', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      artikel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'artikel',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      konten: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'komentar',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create Token table (existing from the starter)
    await queryInterface.createTable('tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create indexes for performance
    // Lahan indexes
    await queryInterface.addIndex('lahan', ['user_id'], {
      name: 'idx_lahan_user_id',
    });

    await queryInterface.addIndex('lahan', ['kecamatan'], {
      name: 'idx_lahan_kecamatan',
    });

    await queryInterface.addIndex('lahan', ['status'], {
      name: 'idx_lahan_status',
    });

    // Creating GIST indexes for geometry columns after table creation
    await queryInterface.sequelize.query('CREATE INDEX idx_lahan_geometry ON lahan USING GIST(geometry);');
    await queryInterface.sequelize.query('CREATE INDEX idx_lahan_centroid ON lahan USING GIST(centroid);');

    // Panen indexes
    await queryInterface.addIndex('panen', ['lahan_id'], {
      name: 'idx_panen_lahan_id',
    });

    await queryInterface.addIndex('panen', ['tanggal_panen'], {
      name: 'idx_panen_tanggal',
      order: 'DESC',
    });

    // Keluhan indexes
    await queryInterface.addIndex('keluhan', ['lahan_id'], {
      name: 'idx_keluhan_lahan_id',
    });

    await queryInterface.addIndex('keluhan', ['status'], {
      name: 'idx_keluhan_status',
    });

    await queryInterface.addIndex('keluhan', ['tanggal_keluhan'], {
      name: 'idx_keluhan_tanggal',
      order: 'DESC',
    });

    // Artikel indexes
    await queryInterface.addIndex('artikel', ['admin_id'], {
      name: 'idx_artikel_admin_id',
    });

    await queryInterface.addIndex('artikel', ['kategori'], {
      name: 'idx_artikel_kategori',
    });

    // Komentar indexes
    await queryInterface.addIndex('komentar', ['artikel_id'], {
      name: 'idx_komentar_artikel_id',
    });

    await queryInterface.addIndex('komentar', ['parent_id'], {
      name: 'idx_komentar_parent_id',
    });

    // Create trigger function for updating 'updated_at' timestamp
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Apply trigger to tables that have 'updated_at' field
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_lahan_updated_at BEFORE UPDATE ON lahan
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_artikel_updated_at BEFORE UPDATE ON artikel
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create trigger for auto-generating centroid from geometry
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_lahan_centroid()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.centroid := ST_Centroid(NEW.geometry);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_update_centroid
          BEFORE INSERT OR UPDATE OF geometry ON lahan
          FOR EACH ROW
          EXECUTE FUNCTION update_lahan_centroid();
    `);
  },

  down: async (queryInterface) => {
    // Drop indexes first
    await queryInterface.removeIndex('lahan', 'idx_lahan_user_id');
    await queryInterface.removeIndex('lahan', 'idx_lahan_kecamatan');
    await queryInterface.removeIndex('lahan', 'idx_lahan_status');
    await queryInterface.removeIndex('panen', 'idx_panen_lahan_id');
    await queryInterface.removeIndex('panen', 'idx_panen_tanggal');
    await queryInterface.removeIndex('keluhan', 'idx_keluhan_lahan_id');
    await queryInterface.removeIndex('keluhan', 'idx_keluhan_status');
    await queryInterface.removeIndex('keluhan', 'idx_keluhan_tanggal');
    await queryInterface.removeIndex('artikel', 'idx_artikel_admin_id');
    await queryInterface.removeIndex('artikel', 'idx_artikel_kategori');
    await queryInterface.removeIndex('komentar', 'idx_komentar_artikel_id');
    await queryInterface.removeIndex('komentar', 'idx_komentar_parent_id');

    // Drop triggers
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_lahan_updated_at ON lahan;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_artikel_updated_at ON artikel;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trigger_update_centroid ON lahan;');

    // Drop functions
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_updated_at_column();');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_lahan_centroid();');

    // Drop tables
    await queryInterface.dropTable('komentar');
    await queryInterface.dropTable('artikel');
    await queryInterface.dropTable('keluhan');
    await queryInterface.dropTable('panen');
    await queryInterface.dropTable('lahan');
    await queryInterface.dropTable('tokens');
    await queryInterface.dropTable('users');

    // Drop indexes that were created directly on geometry columns
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_lahan_geometry;');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_lahan_centroid;');
  },
};
