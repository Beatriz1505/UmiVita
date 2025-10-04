const express = require('express');
const router = express.Router();
const SensorController = require('../controllers/SensorController');

// Rotas para sensor

// GET /sensores - listar sensores, com filtro opicional por área via query ?areaId=1
router.get('/', SensorController.listarSensores);

// GET /sensores/:id - buscar sensor por ID
router.get('/:id', SensorController.buscarSensorPorId);

// POST /sensores - criar novo sensor
router.post('/', SensorController.criarSensor);

// PUT /sensores/:id - atualizar sensor
router.put('/:id', SensorController.atualizarSensor);

// DELETE /sensores/:id - deletar sensor
router.delete('/:id', SensorController.deletarSensor);

module.exports = router;
