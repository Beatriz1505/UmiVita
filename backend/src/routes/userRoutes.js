const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Rotas para usuários

// GET /usuarios - listar todos os usuários (normalmente acesso restrito)
router.get('/', UserController.listarUsuarios);

// GET /usuarios/:id - buscar usuário por ID
router.get('/:id', UserController.buscarUsuarioPorId);

// POST /usuarios - criar novo usuário
router.post('/', UserController.criarUsuario);

// PUT /usuarios/:id - atualizar usuário
router.put('/:id', UserController.atualizarUsuario);

// DELETE /usuarios/:id - deletar usuário
router.delete('/:id', UserController.deletarUsuario);

module.exports = router;
