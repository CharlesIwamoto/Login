'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
      },
      internal: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        references: { model: "tickets", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable('comments');

  }
};
