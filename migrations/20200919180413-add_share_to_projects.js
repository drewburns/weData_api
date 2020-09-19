"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "Projects", // table name
      "shared", // new field name
      {
        type: Sequelize.BOOLEAN,
        default: false,
        // allowNull: false,
      }
    );
    await queryInterface.addColumn(
      "Projects", // table name
      "share_uuid", // new field name
      {
        type: Sequelize.STRING,
        // default: "",
        // allowNull: false,
      }
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
