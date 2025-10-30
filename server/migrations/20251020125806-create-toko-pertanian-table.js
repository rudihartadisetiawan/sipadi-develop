'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('toko_pertanian', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nama_toko: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jam_buka: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      jam_tutup: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      produk: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'aktif',
      },
      geometry: {
        type: 'GEOMETRY(POINT, 4326)',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.sequelize.query('CREATE INDEX idx_toko_pertanian_geometry ON toko_pertanian USING GIST(geometry);');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_toko_pertanian_geometry;');
    await queryInterface.dropTable('toko_pertanian');
  }
};
