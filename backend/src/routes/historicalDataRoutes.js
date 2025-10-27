const express = require('express');
const router = express.Router();
const HistoricalDataController = require('../controllers/HistoricalDataController');
const authMiddleware = require('../middlewares/authMiddleware');

// ⬇️ ROTA PÚBLICA PARA ESP32 (SEM AUTENTICAÇÃO)
router.post('/', HistoricalDataController.criarHistorico);

// ⬇️ TODAS AS OUTRAS ROTAS PRECISAM DE AUTENTICAÇÃO
router.use(authMiddleware);

// ⚠️ ATENÇÃO: Rotas específicas (/stats, /export) PRECISAM vir ANTES da rota /:id
// Caso contrário, Express vai interpretar "stats" ou "export" como um ID!

// GET /api/historicos/stats - estatísticas do histórico
router.get('/stats', HistoricalDataController.getStats);

// GET /api/historicos/export - exportar dados para CSV
router.get('/export', HistoricalDataController.exportCSV);

// GET /api/historicos - listar dados históricos COM PAGINAÇÃO E FILTROS
router.get('/', HistoricalDataController.listarHistoricos);

// GET /api/historicos/:id - buscar dado histórico por ID
router.get('/:id', HistoricalDataController.buscarHistoricoPorId);

// PUT /api/historicos/:id - atualizar dado histórico
router.put('/:id', HistoricalDataController.atualizarHistorico);

// DELETE /api/historicos/:id - deletar dado histórico
router.delete('/:id', HistoricalDataController.deletarHistorico);

module.exports = router;
