const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de notificações precisam de autenticação
router.use(authMiddleware);

// GET /api/notificacoes - listar notificações, filtro opcional por área e status via query ?areaId=1&status=nao_visualizada
router.get('/', NotificationController.listarNotificacoes);

// GET /api/notificacoes/:id - buscar notificação por ID
router.get('/:id', NotificationController.buscarNotificacaoPorId);

// POST /api/notificacoes - criar nova notificação
router.post('/', NotificationController.criarNotificacao);

// PUT /api/notificacoes/:id - atualizar notificação
router.put('/:id', NotificationController.atualizarNotificacao);

// DELETE /api/notificacoes/:id - deletar notificação
router.delete('/:id', NotificationController.deletarNotificacao);

module.exports = router;
