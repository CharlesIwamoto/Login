'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "profile", {
      type: Sequelize.ENUM("ADMIN", "ANALYST", "USER"),
      allowNull: false,
      defaultValue: "USER"
    });

  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "profile");

  }
};
