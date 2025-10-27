const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/auth/register - Registrar novo usuário
router.post('/register', AuthController.register);

// POST /api/auth/login - Login
router.post('/login', AuthController.login);

// GET /api/auth/me - Buscar usuário logado (protegida)
router.get('/me', authMiddleware, AuthController.me);

module.exports = router;
