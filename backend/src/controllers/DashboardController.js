const { Area, Sensor, HistoricalData, Notification, sequelize } = require('../database/models');
const { Op } = require('sequelize');

const DashboardController = {
  // GET /api/dashboard/stats - Estatísticas gerais
  async getStats(req, res) {
    try {
      // Conta totais
      const totalAreas = await Area.count();
      const totalSensores = await Sensor.count();
      const totalNotificacoes = await Notification.count();
      const notificacoesNaoLidas = await Notification.count({
        where: { status: 'nao_visualizada' }
      });

      // Áreas por status de risco
      const areasPorRisco = await Area.findAll({
        attributes: [
          'status_risco',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        group: ['status_risco']
      });

      // Últimas leituras (10 mais recentes para calcular médias)
      const ultimasLeituras = await HistoricalData.findAll({
        limit: 10,
        order: [['dataHora', 'DESC']],
        include: [{ model: Sensor, as: 'sensor' }]
      });

      // Calcular médias de temperatura e umidade
      let temperaturaMedia = 0;
      let umidadeMedia = 0;
      let countTemp = 0;
      let countUmid = 0;

      ultimasLeituras.forEach(leitura => {
        if (leitura.temperatura > 0) {
          temperaturaMedia += leitura.temperatura;
          countTemp++;
        }
        if (leitura.umidade > 0) {
          umidadeMedia += leitura.umidade;
          countUmid++;
        }
      });

      temperaturaMedia = countTemp > 0 ? temperaturaMedia / countTemp : 0;
      umidadeMedia = countUmid > 0 ? umidadeMedia / countUmid : 0;

      // Contar alertas ativos (umidade < 30% ou temperatura > 30°C)
      const alertasAtivos = ultimasLeituras.filter(
        l => l.umidade < 30 || l.temperatura > 30
      ).length;

      return res.status(200).json({
        totais: {
          areas: totalAreas,
          sensores: totalSensores,
          notificacoes: totalNotificacoes,
          notificacoesNaoLidas: notificacoesNaoLidas
        },
        areasPorRisco,
        ultimasLeituras: ultimasLeituras.slice(0, 5),
        temperaturaMedia,
        umidadeMedia,
        totalAreas,
        alertasAtivos
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
    }
  },

  // GET /api/dashboard/alertas-recentes - Alertas recentes
  async getAlertasRecentes(req, res) {
    try {
      const alertas = await Notification.findAll({
        limit: 10,
        order: [['dataHora', 'DESC']],
        where: { nivelRisco: ['medio', 'alto'] },
        include: [{ model: Area, as: 'area' }]
      });

      return res.status(200).json(alertas);
    } catch (error) {
      console.error('Erro ao buscar alertas recentes:', error);
      return res.status(500).json({ erro: 'Erro ao buscar alertas' });
    }
  },

  // GET /api/dashboard/sensores-live - Dados dos 3 sensores em tempo real
  async getSensoresLive(req, res) {
    try {
      // Buscar os últimos dados de cada sensor (1, 2, 3)
      const dadosSensores = await Promise.all([
        HistoricalData.findOne({
          where: { sensorId: 1 },
          order: [['dataHora', 'DESC']],
          include: [{ model: Sensor, as: 'sensor' }]
        }),
        HistoricalData.findOne({
          where: { sensorId: 2 },
          order: [['dataHora', 'DESC']],
          include: [{ model: Sensor, as: 'sensor' }]
        }),
        HistoricalData.findOne({
          where: { sensorId: 3 },
          order: [['dataHora', 'DESC']],
          include: [{ model: Sensor, as: 'sensor' }]
        })
      ]);

      // Formatar os dados
      const dadosFormatados = dadosSensores.map((dado, index) => {
        if (!dado) {
          return {
            id: index + 1,
            tipo: 'desconhecido',
            temperatura: 0,
            umidade: 0,
            nivel_contaminacao: 'baixo',
            dataHora: null,
          };
        }

        return {
          id: dado.sensorId,
          tipo: dado.sensor?.tipo || 'desconhecido',
          temperatura: dado.temperatura || 0,
          umidade: dado.umidade || 0,
          nivel_contaminacao: dado.nivel_contaminacao || 'baixo',
          dataHora: dado.dataHora,
        };
      });

      return res.status(200).json(dadosFormatados);
    } catch (error) {
      console.error('Erro ao buscar sensores live:', error);
      return res.status(500).json({ erro: 'Erro ao buscar sensores', detalhes: error.message });
    }
  },

  // GET /api/dashboard/grafico-data - Dados para gráfico (últimas 24h)
  async getGraficoData(req, res) {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const dados = await HistoricalData.findAll({
        where: {
          dataHora: { [Op.gte]: oneDayAgo },
          sensorId: [1, 2, 3]
        },
        include: [{
          model: Sensor,
          as: 'sensor',
          attributes: ['tipo']
        }],
        order: [['dataHora', 'ASC']],
      });

      return res.status(200).json(dados);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      return res.status(500).json({ erro: 'Erro ao buscar dados do gráfico', detalhes: error.message });
    }
  },
};

module.exports = DashboardController;
