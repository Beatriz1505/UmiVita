const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de dashboard precisam de autenticação
router.use(authMiddleware);

// GET /api/dashboard/stats - Estatísticas gerais
router.get('/stats', DashboardController.getStats);

// GET /api/dashboard/alertas-recentes - Alertas recentes
router.get('/alertas-recentes', DashboardController.getAlertasRecentes);

// GET /api/dashboard/sensores-live - Dados dos 3 sensores em tempo real
router.get('/sensores-live', DashboardController.getSensoresLive);

// GET /api/dashboard/grafico-data - Dados para gráfico (últimas 24h)
router.get('/grafico-data', DashboardController.getGraficoData);

module.exports = router;
