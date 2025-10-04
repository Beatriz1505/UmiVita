const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco OK!');
    process.exit(0);
  } catch (error) {
    console.error('Não foi possível conectar:', error);
    process.exit(1);
  }
}

testConnection();
