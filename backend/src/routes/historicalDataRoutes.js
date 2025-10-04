const express = require('express');
const router = express.Router();
const HistoricalDataController = require('../controllers/HistoricalDataController');

// Rotas para dados históricos

// GET /historicos - listar dados históricos, filtro opcional por sensor ?sensorId=1
router.get('/', HistoricalDataController.listarHistoricos);

// GET /historicos/:id - buscar dado histórico por ID
router.get('/:id', HistoricalDataController.buscarHistoricoPorId);

// POST /historicos - criar novo dado histórico
router.post('/', HistoricalDataController.criarHistorico);

// PUT /historicos/:id - atualizar dado histórico
router.put('/:id', HistoricalDataController.atualizarHistorico);

// DELETE /historicos/:id - deletar dado histórico
router.delete('/:id', HistoricalDataController.deletarHistorico);

module.exports = router;
