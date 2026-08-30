'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('tickets', 'categories_id', 'category_id');

  },

  async down(queryInterface) {
    await queryInterface.renameColumn('tickets', 'category_id', 'categories_id');

  }
};
