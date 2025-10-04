const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./database/models'); // Ajuste o caminho conforme sua estrutura

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais 🛠️
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rota raiz 🚀
app.get('/', (req, res) => {
  res.send('🚀 Servidor UmiVita está rodando! Tudo pronto para monitoramento ambiental 🌍');
});

// Testa a conexão com o banco de dados 🗄️
sequelize.authenticate()
  .then(() => console.log('✅ Banco de dados conectado com sucesso! Parabéns! 🎉'))
  .catch(err => console.error('❌ Erro ao conectar ao banco:', err));

// Inicia o servidor 📡
app.listen(PORT, () => {
  console.log(`🟢 Servidor UmiVita rodando na porta ${PORT}. Aguardando requisições...`);
});

// Mensagem de boas-vindas para qualquer rota inválida 404 🔍
app.use((req, res) => {
  res.status(404).send('⚠️ Rota não encontrada. Verifique o caminho e tente novamente.');
});

// Middleware global de tratamento de erros 💥
app.use((err, req, res, next) => {
  console.error('🔥 Erro inesperado:', err);
  res.status(500).json({ message: 'Erro interno no servidor, tente novamente mais tarde.' });
});
