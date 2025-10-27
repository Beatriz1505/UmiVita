'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Areas', [
      {
        nome: 'Área Portuária A',
        descricao: 'Zona de armazenamento de containers',
        coordenadas: JSON.stringify({ lat: -23.9618, lng: -46.3322 }),
        status_risco: 'baixo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Área Portuária B',
        descricao: 'Zona de descarga de navios',
        coordenadas: JSON.stringify({ lat: -23.9628, lng: -46.3342 }),
        status_risco: 'medio',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Área Portuária C',
        descricao: 'Zona de armazenamento de químicos',
        coordenadas: JSON.stringify({ lat: -23.9638, lng: -46.3362 }),
        status_risco: 'alto',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Areas', null, {});
  },
};
