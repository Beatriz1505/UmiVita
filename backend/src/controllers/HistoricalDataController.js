const { HistoricalData, Sensor } = require('../database/models');

const HistoricalDataController = {
  // Listar dados históricos, opcionalmente por sensor
  async listarHistoricos(req, res) {
    const { sensorId } = req.query;
    try {
      const filtros = sensorId ? { where: { sensorId } } : {};
      const historicos = await HistoricalData.findAll(filtros);
      return res.status(200).json(historicos);
    } catch (error) {
      console.error('Erro ao listar dados históricos:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar dados históricos' });
    }
  },

  // Buscar histórico por ID
  async buscarHistoricoPorId(req, res) {
    const { id } = req.params;
    try {
      const historico = await HistoricalData.findByPk(id);
      if (!historico) {
        return res.status(404).json({ erro: 'Dados históricos não encontrados' });
      }
      return res.status(200).json(historico);
    } catch (error) {
      console.error(`Erro ao buscar histórico id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao buscar dados históricos' });
    }
  },

  // Criar dado histórico
  async criarHistorico(req, res) {
    const { sensorId, dataHora, temperatura, umidade } = req.body;
    try {
      // Verifica se sensor existe
      const sensor = await Sensor.findByPk(sensorId);
      if (!sensor) {
        return res.status(400).json({ erro: 'Sensor inválido para dados históricos' });
      }
      const novoHistorico = await HistoricalData.create({ sensorId, dataHora, temperatura, umidade });
      return res.status(201).json(novoHistorico);
    } catch (error) {
      console.error('Erro ao criar dado histórico:', error);
      return res.status(500).json({ erro: 'Erro interno ao criar dado histórico' });
    }
  },

  // Atualizar dado histórico
  async atualizarHistorico(req, res) {
    const { id } = req.params;
    const { dataHora, temperatura, umidade } = req.body;
    try {
      const historico = await HistoricalData.findByPk(id);
      if (!historico) {
        return res.status(404).json({ erro: 'Dados históricos não encontrados' });
      }
      await historico.update({ dataHora, temperatura, umidade });
      return res.status(200).json(historico);
    } catch (error) {
      console.error(`Erro ao atualizar histórico id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar dado histórico' });
    }
  },

  // Deletar dado histórico
  async deletarHistorico(req, res) {
    const { id } = req.params;
    try {
      const historico = await HistoricalData.findByPk(id);
      if (!historico) {
        return res.status(404).json({ erro: 'Dados históricos não encontrados' });
      }
      await historico.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao deletar histórico id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao deletar dado histórico' });
    }
  },
};

module.exports = HistoricalDataController;
