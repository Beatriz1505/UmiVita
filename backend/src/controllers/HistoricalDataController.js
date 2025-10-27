const { HistoricalData, Sensor, Area, sequelize } = require('../database/models');
const { Op } = require('sequelize');

const HistoricalDataController = {
  // Listar dados históricos COM PAGINAÇÃO, FILTROS E INCLUDES
  async listarHistoricos(req, res) {
    const { sensorId, page = 1, limit = 20, search } = req.query;
    
    try {
      const offset = (page - 1) * limit;
      
      // Construir filtros
      const where = {};
      if (sensorId && sensorId !== 'todos') {
        where.sensorId = sensorId;
      }
      
      if (search) {
        where[Op.or] = [
          { nivel_contaminacao: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const { count, rows } = await HistoricalData.findAndCountAll({
        where,
        include: [
          {
            model: Sensor,
            as: 'sensor',
            attributes: ['id', 'tipo'],
            include: [
              { 
                model: Area, 
                as: 'area',
                attributes: ['id', 'nome']
              }
            ]
          }
        ],
        attributes: ['id', 'sensorId', 'temperatura', 'umidade', 'nivel_contaminacao', 'dataHora'],
        order: [['dataHora', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      return res.status(200).json({
        data: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error('Erro ao listar dados históricos:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar dados históricos' });
    }
  },

  // Buscar histórico por ID
  async buscarHistoricoPorId(req, res) {
    const { id } = req.params;
    try {
      const historico = await HistoricalData.findByPk(id, {
        include: [
          {
            model: Sensor,
            as: 'sensor',
            include: [{ model: Area, as: 'area' }]
          }
        ],
        attributes: ['id', 'sensorId', 'temperatura', 'umidade', 'nivel_contaminacao', 'dataHora']
      });
      
      if (!historico) {
        return res.status(404).json({ erro: 'Dados históricos não encontrados' });
      }
      return res.status(200).json(historico);
    } catch (error) {
      console.error(`Erro ao buscar histórico id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao buscar dados históricos' });
    }
  },

  // Criar histórico (ESP32)
  async criarHistorico(req, res) {
    const { sensorId, sensor_id, dataHora, temperatura, umidade, nivel_contaminacao } = req.body;
    try {
      const idSensor = sensorId || sensor_id;
      
      if (!idSensor) {
        return res.status(400).json({ erro: 'sensorId ou sensor_id é obrigatório' });
      }

      const sensor = await Sensor.findByPk(idSensor);
      if (!sensor) {
        return res.status(400).json({ erro: 'Sensor inválido para dados históricos' });
      }

      const novoHistorico = await HistoricalData.create({ 
        sensorId: idSensor,
        dataHora: dataHora || new Date(),
        temperatura, 
        umidade,
        nivel_contaminacao: nivel_contaminacao || 'baixo'
      });

      return res.status(201).json(novoHistorico);
    } catch (error) {
      console.error('Erro ao criar dado histórico:', error);
      return res.status(500).json({ erro: 'Erro interno ao criar dado histórico', detalhes: error.message });
    }
  },

  // Atualizar dado histórico
  async atualizarHistorico(req, res) {
    const { id } = req.params;
    const { dataHora, temperatura, umidade, nivel_contaminacao } = req.body;
    try {
      const historico = await HistoricalData.findByPk(id);
      if (!historico) {
        return res.status(404).json({ erro: 'Dados históricos não encontrados' });
      }
      await historico.update({ dataHora, temperatura, umidade, nivel_contaminacao });
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

  // NOVA: Estatísticas do histórico
  async getStats(req, res) {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      // Total de eventos
      const totalEventos = await HistoricalData.count();
      
      // Alertas gerados (temperatura > 30 ou umidade < 30)
      const alertasGerados = await HistoricalData.count({
        where: {
          [Op.or]: [
            { temperatura: { [Op.gt]: 30 } },
            { umidade: { [Op.lt]: 30 } }
          ]
        }
      });
      
      // Leituras de temperatura (temperatura > 0)
      const leiturasTemp = await HistoricalData.count({
        where: { temperatura: { [Op.gt]: 0 } }
      });
      
      // Leituras de umidade (umidade > 0)
      const leiturasUmid = await HistoricalData.count({
        where: { umidade: { [Op.gt]: 0 } }
      });
      
      return res.status(200).json({
        totalEventos,
        alertasGerados,
        leiturasTemp,
        leiturasUmid
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
    }
  },

  // NOVA: Exportar para CSV
  async exportCSV(req, res) {
    try {
      const historicos = await HistoricalData.findAll({
        include: [
          {
            model: Sensor,
            as: 'sensor',
            include: [{ model: Area, as: 'area' }]
          }
        ],
        attributes: ['id', 'sensorId', 'temperatura', 'umidade', 'nivel_contaminacao', 'dataHora'],
        order: [['dataHora', 'DESC']]
      });
      
      // Cabeçalho CSV
      let csv = 'ID,Data/Hora,Sensor,Tipo,Área,Temperatura,Umidade,Contaminação\n';
      
      // Dados
      historicos.forEach(h => {
        const data = new Date(h.dataHora).toLocaleString('pt-BR');
        const sensor = h.sensor?.tipo || 'N/A';
        const area = h.sensor?.area?.nome || 'N/A';
        csv += `${h.id},${data},${h.sensorId},${sensor},${area},${h.temperatura},${h.umidade},${h.nivel_contaminacao}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=historico.csv');
      return res.status(200).send('\uFEFF' + csv); // BOM para UTF-8
      
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      return res.status(500).json({ erro: 'Erro ao exportar dados' });
    }
  }
};

module.exports = HistoricalDataController;
