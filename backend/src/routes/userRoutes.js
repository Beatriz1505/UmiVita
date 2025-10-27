const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// GET /api/usuarios - listar todos os usuários (apenas admin)
router.get('/', authMiddleware, adminMiddleware, UserController.listarUsuarios);

// GET /api/usuarios/:id - buscar usuário por ID (apenas admin)
router.get('/:id', authMiddleware, adminMiddleware, UserController.buscarUsuarioPorId);

// POST /api/usuarios - criar novo usuário (PÚBLICO - SEM MIDDLEWARE)
router.post('/', UserController.criarUsuario);  // ⬅️ SEM AUTENTICAÇÃO

// PUT /api/usuarios/:id - atualizar usuário (apenas admin)
router.put('/:id', authMiddleware, adminMiddleware, UserController.atualizarUsuario);

// DELETE /api/usuarios/:id - deletar usuário (apenas admin)
router.delete('/:id', authMiddleware, adminMiddleware, UserController.deletarUsuario);

module.exports = router;
