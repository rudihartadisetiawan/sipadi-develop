/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('keluhan', 'foto_bukti', {
      type: Sequelize.TEXT,
      allowNull: true, // Allow null if no photos are uploaded
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('keluhan', 'foto_bukti', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
