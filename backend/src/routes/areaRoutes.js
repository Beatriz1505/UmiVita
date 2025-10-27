const express = require('express');
const router = express.Router();
const AreaController = require('../controllers/AreaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de áreas precisam de autenticação
router.use(authMiddleware);

// GET /api/areas - listar todas as áreas
router.get('/', AreaController.listarAreas);

// GET /api/areas/:id - buscar área por ID
router.get('/:id', AreaController.buscarAreaPorId);

// POST /api/areas - criar nova área
router.post('/', AreaController.criarArea);

// PUT /api/areas/:id - atualizar área existente
router.put('/:id', AreaController.atualizarArea);

// DELETE /api/areas/:id - deletar área
router.delete('/:id', AreaController.deletarArea);

module.exports = router;
