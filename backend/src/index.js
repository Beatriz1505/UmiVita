require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./database/models');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => console.log('Banco conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar banco:', err));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
