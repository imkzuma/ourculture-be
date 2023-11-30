'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type:Sequelize.STRING,
        allowNull: false
      },
      password: {
        type:Sequelize.STRING, 
        allowNull: true
      },
      googleId: {
        type:Sequelize.STRING, 
        allowNull: true
      },
      googleToken: {
        type:Sequelize.TEXT, 
        allowNull: true
      },
      avatar: {
        type:Sequelize.STRING, 
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return queryInterface.dropTable('users');
  }
};
