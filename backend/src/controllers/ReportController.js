const db = require('../database/models');
const { Op } = require('sequelize');

// Importar models
const Area = db.Area;
const Sensor = db.Sensor;
const HistoricalData = db.HistoricalData;
const Notification = db.Notification;

// Obter estatísticas de relatórios
const getReportStats = async (req, res) => {
  try {
    const areas = await Area.findAll();
    const leituras = HistoricalData ? await HistoricalData.findAll() : [];
    const notificacoes = Notification ? await Notification.findAll() : [];

    const totalRelatorios = 15; // Número fixo de relatórios gerados
    const geradosEsteMes = 3; // Relatórios gerados este mês
    const downloads = 45; // Total de downloads

    // Calcular último gerado
    let ultimoGerado = 'Hoje';
    if (leituras.length > 0) {
      const ultimaLeitura = leituras[leituras.length - 1];
      const dataUltimaLeitura = new Date(ultimaLeitura.createdAt);
      const hoje = new Date();
      const diffTime = Math.abs(hoje - dataUltimaLeitura);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        ultimoGerado = 'Hoje';
      } else if (diffDays === 1) {
        ultimoGerado = 'Ontem';
      } else {
        ultimoGerado = `${diffDays}d atrás`;
      }
    }

    return res.json({
      totalRelatorios,
      geradosEsteMes,
      downloads,
      ultimoGerado,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar estatísticas de relatórios',
      message: error.message,
    });
  }
};

// Listar relatórios disponíveis
const getReportList = async (req, res) => {
  try {
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

    const relatorios = [
      {
        id: 1,
        titulo: 'Relatório Mensal',
        subtitulo: 'Outubro 2025',
        tipo: 'Mensal',
        data: hoje.toLocaleDateString('pt-BR'),
        tamanho: '2.5 MB',
        color: '#4FC3F7',
        colorEnd: '#29B6F6',
      },
      {
        id: 2,
        titulo: 'Relatório Semanal',
        subtitulo: 'Semana 40',
        tipo: 'Semanal',
        data: seteDiasAtras.toLocaleDateString('pt-BR'),
        tamanho: '850 KB',
        color: '#5ADB62',
        colorEnd: '#2EE9B4',
      },
      {
        id: 3,
        titulo: 'Relatório de Alertas',
        subtitulo: 'Últimos Alertas',
        tipo: 'Alertas',
        data: hoje.toLocaleDateString('pt-BR'),
        tamanho: '1.2 MB',
        color: '#FF6B6B',
        colorEnd: '#FF8E53',
      },
    ];

    return res.json(relatorios);
  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao listar relatórios',
      message: error.message,
    });
  }
};

// Gerar novo relatório
const generateReport = async (req, res) => {
  try {
    const { tipo = 'mensal' } = req.body;

    console.log('🔄 Gerando relatório tipo:', tipo);

    // Buscar áreas com sensores
    const areas = await Area.findAll({
      include: [
        {
          model: Sensor,
          as: 'sensores',
          required: false,
        },
      ],
    });
    console.log('✅ Áreas encontradas:', areas.length);

    // Buscar todos os sensores
    const sensores = await Sensor.findAll();
    console.log('✅ Sensores encontrados:', sensores.length);

    // Buscar leituras históricas
    let leituras = [];
    if (HistoricalData) {
      try {
        leituras = await HistoricalData.findAll({
          include: [
            {
              model: Sensor,
              as: 'sensor',
              required: false,
              include: [
                {
                  model: Area,
                  as: 'area',
                  required: false,
                },
              ],
            },
          ],
          order: [['dataHora', 'DESC']],
          limit: 100,
        });
        console.log('✅ Leituras encontradas:', leituras.length);
      } catch (error) {
        console.log('⚠️ Erro ao buscar leituras:', error.message);
      }
    }

    // Buscar notificações/alertas
    let notificacoes = [];
    if (Notification) {
      try {
        notificacoes = await Notification.findAll({
          where: { 
            nivelRisco: { [Op.in]: ['alto', 'medio'] } 
          },
          include: [
            {
              model: Area,
              as: 'area',
              required: false,
            },
          ],
          order: [['dataHora', 'DESC']],
          limit: 10,
        });
        console.log('✅ Notificações encontradas:', notificacoes.length);
      } catch (error) {
        console.log('⚠️ Erro ao buscar notificações:', error.message);
      }
    }

    // Calcular estatísticas por área
    const areasComDados = areas.map(area => {
      const sensoresArea = area.sensores || sensores.filter(
        s => s.area_id === area.id || s.areaId === area.id
      );
      
      const sensorIds = sensoresArea.map(s => s.id);
      const leiturasArea = leituras.filter(
        l => sensorIds.includes(l.sensor_id || l.sensorId)
      );
      
      const ultimaLeitura = leiturasArea.length > 0 
        ? leiturasArea[0].dataHora || leiturasArea[0].createdAt 
        : null;

      return {
        id: area.id,
        nome: area.nome,
        localizacao: area.localizacao || 'Não especificado',
        status_risco: area.status_risco || 'normal',
        sensores: sensoresArea.length,
        ultimaLeitura: ultimaLeitura 
          ? new Date(ultimaLeitura).toLocaleString('pt-BR') 
          : 'Sem leituras',
      };
    });

    // Formatar alertas
    const alertasFormatados = notificacoes.map(notif => ({
      id: notif.id,
      mensagem: notif.mensagem,
      nivel: notif.nivelRisco,
      area: notif.area?.nome || 'Área não especificada',
      data: new Date(notif.dataHora).toLocaleString('pt-BR'),
    }));

    // Calcular resumo
    const resumo = {
      totalAreas: areas.length,
      totalSensores: sensores.length,
      areasEmAlerta: areas.filter(
        a => a.status_risco === 'alto' || a.status_risco === 'medio'
      ).length,
      totalLeituras: leituras.length,
      totalAlertas: notificacoes.length,
    };

    // Montar relatório completo
    const relatorio = {
      tipo,
      dataGeracao: new Date().toISOString(),
      resumo,
      areas: areasComDados,
      alertas: alertasFormatados,
      periodo: {
        inicio: leituras.length > 0 
          ? new Date(leituras[leituras.length - 1].dataHora).toLocaleDateString('pt-BR')
          : 'N/A',
        fim: leituras.length > 0
          ? new Date(leituras[0].dataHora).toLocaleDateString('pt-BR')
          : 'N/A',
      },
    };

    // Calcular tamanho
    const tamanhoKB = JSON.stringify(relatorio).length / 1024;
    const tamanho = tamanhoKB > 1024 
      ? `${(tamanhoKB / 1024).toFixed(1)} MB` 
      : `${tamanhoKB.toFixed(0)} KB`;

    console.log('✅ Relatório gerado com sucesso!');
    console.log('📊 Resumo:', resumo);

    return res.json({
      success: true,
      mensagem: 'Relatório gerado com sucesso!',
      relatorio,
      tamanho,
    });
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao gerar relatório', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

module.exports = {
  getReportStats,
  getReportList,
  generateReport,
};
