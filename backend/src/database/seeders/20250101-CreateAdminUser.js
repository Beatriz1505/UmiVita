'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        nome: 'Administrador UmiVita',
        email: 'admin@umivita.com',
        senhaHash: senhaHash,
        perfil: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@umivita.com' }, {});
  },
};
