const { Sensor, Area } = require('../database/models');

const SensorController = {
  // Listar sensores, opcionalmente por área
  async listarSensores(req, res) {
    const { areaId } = req.query;
    try {
      const filtros = areaId ? { where: { areaId } } : {};
      const sensores = await Sensor.findAll(filtros);
      return res.status(200).json(sensores);
    } catch (error) {
      console.error('Erro ao listar sensores:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar sensores' });
    }
  },

  // Buscar sensor por ID
  async buscarSensorPorId(req, res) {
    const { id } = req.params;
    try {
      const sensor = await Sensor.findByPk(id);
      if (!sensor) {
        return res.status(404).json({ erro: 'Sensor não encontrado' });
      }
      return res.status(200).json(sensor);
    } catch (error) {
      console.error(`Erro ao buscar sensor id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao buscar sensor' });
    }
  },

  // Criar sensor
  async criarSensor(req, res) {
    const { tipo, status, areaId } = req.body;
    try {
      // Verifica se área existe para associar
      const area = await Area.findByPk(areaId);
      if (!area) {
        return res.status(400).json({ erro: 'Área inválida para sensor' });
      }
      const novoSensor = await Sensor.create({ tipo, status, areaId });
      return res.status(201).json(novoSensor);
    } catch (error) {
      console.error('Erro ao criar sensor:', error);
      return res.status(500).json({ erro: 'Erro interno ao criar sensor' });
    }
  },

  // Atualizar sensor
  async atualizarSensor(req, res) {
    const { id } = req.params;
    const { tipo, status, areaId } = req.body;
    try {
      const sensor = await Sensor.findByPk(id);
      if (!sensor) {
        return res.status(404).json({ erro: 'Sensor não encontrado' });
      }
      if (areaId) {
        const area = await Area.findByPk(areaId);
        if (!area) {
          return res.status(400).json({ erro: 'Área inválida para sensor' });
        }
      }
      await sensor.update({ tipo, status, areaId });
      return res.status(200).json(sensor);
    } catch (error) {
      console.error(`Erro ao atualizar sensor id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar sensor' });
    }
  },

  // Deletar sensor
  async deletarSensor(req, res) {
    const { id } = req.params;
    try {
      const sensor = await Sensor.findByPk(id);
      if (!sensor) {
        return res.status(404).json({ erro: 'Sensor não encontrado' });
      }
      await sensor.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao deletar sensor id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao deletar sensor' });
    }
  },
};

module.exports = SensorController;
