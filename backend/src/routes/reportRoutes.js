const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const authMiddleware = require('../middlewares/authMiddleware');

// ========================================
// ROTAS DE RELATÓRIOS (PROTEGIDAS)
// ========================================

// GET /api/relatorios/stats - Buscar estatísticas de relatórios
router.get('/stats', authMiddleware, ReportController.getReportStats);

// GET /api/relatorios - Listar relatórios disponíveis
router.get('/', authMiddleware, ReportController.getReportList);

// POST /api/relatorios/gerar - Gerar novo relatório
router.post('/gerar', authMiddleware, ReportController.generateReport);

module.exports = router;
