const express = require('express');
const router = express.Router();
const SensorController = require('../controllers/SensorController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de sensores precisam de autenticação
router.use(authMiddleware);

// GET /api/sensores - listar sensores, com filtro opcional por área via query ?areaId=1
router.get('/', SensorController.listarSensores);

// GET /api/sensores/:id - buscar sensor por ID
router.get('/:id', SensorController.buscarSensorPorId);

// POST /api/sensores - criar novo sensor
router.post('/', SensorController.criarSensor);

// PUT /api/sensores/:id - atualizar sensor
router.put('/:id', SensorController.atualizarSensor);

// DELETE /api/sensores/:id - deletar sensor
router.delete('/:id', SensorController.deletarSensor);

module.exports = router;
