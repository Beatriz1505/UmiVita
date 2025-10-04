// Carrega as variáveis de ambiente do arquivo .env para process.env
require('dotenv').config();

// Exporta a configuração do Sequelize para diferentes ambientes (development, test, production)
module.exports = {
  development: {
    // Nome do usuário do banco de dados obtido da variável de ambiente DB_USER
    username: process.env.DB_USER,
    
    // Senha do banco de dados, de DB_PASS
    password: process.env.DB_PASS,
    
    // Nome do banco de dados a ser usado
    database: process.env.DB_NAME,
    
    // Host onde o banco está rodando (ex: localhost)
    host: process.env.DB_HOST,
    
    // Dialeto do banco de dados (ex: mysql, postgres)
    dialect: process.env.DB_DIALECT
  },

  // Configuração para ambiente de teste (test)
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  },

  // Configuração para ambiente de produção
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
};
