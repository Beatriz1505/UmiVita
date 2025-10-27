const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const areaRoutes = require('./routes/areaRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const historicalDataRoutes = require('./routes/historicalDataRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.get('/teste', (req, res) => {
  res.send('Servidor ativo');
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes); // ⬅️ NOVA ROTA
app.use('/api/areas', areaRoutes);
app.use('/api/sensores', sensorRoutes);
app.use('/api/historicos', historicalDataRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/notificacoes', notificationRoutes);
app.use('/api/relatorios', reportRoutes);

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada. Verifique o caminho e tente novamente.' });
});

// Middleware erro global
app.use((err, req, res, next) => {
  console.error('Erro inesperado:', err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;
