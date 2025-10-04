const { Notification, Area } = require('../database/models');

const NotificationController = {
  // Listar notificações, opcionalmente por área e status
  async listarNotificacoes(req, res) {
    const { areaId, status } = req.query;
    try {
      const filtros = {};
      if (areaId) filtros.areaId = areaId;
      if (status) filtros.status = status;
      const notificacoes = await Notification.findAll({ where: filtros });
      return res.status(200).json(notificacoes);
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar notificações' });
    }
  },

  // Buscar notificação por ID
  async buscarNotificacaoPorId(req, res) {
    const { id } = req.params;
    try {
      const notificacao = await Notification.findByPk(id);
      if (!notificacao) {
        return res.status(404).json({ erro: 'Notificação não encontrada' });
      }
      return res.status(200).json(notificacao);
    } catch (error) {
      console.error(`Erro ao buscar notificação id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao buscar notificação' });
    }
  },

  // Criar nova notificação
  async criarNotificacao(req, res) {
    const { areaId, mensagem, nivelRisco, dataHora, status } = req.body;
    try {
      // Verifica se área existe
      const area = await Area.findByPk(areaId);
      if (!area) return res.status(400).json({ erro: 'Área inválida para notificação' });

      const novaNotificacao = await Notification.create({ areaId, mensagem, nivelRisco, dataHora, status });
      return res.status(201).json(novaNotificacao);
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return res.status(500).json({ erro: 'Erro interno ao criar notificação' });
    }
  },

  // Atualizar notificação
  async atualizarNotificacao(req, res) {
    const { id } = req.params;
    const { mensagem, nivelRisco, dataHora, status } = req.body;
    try {
      const notificacao = await Notification.findByPk(id);
      if (!notificacao) return res.status(404).json({ erro: 'Notificação não encontrada' });
      await notificacao.update({ mensagem, nivelRisco, dataHora, status });
      return res.status(200).json(notificacao);
    } catch (error) {
      console.error(`Erro ao atualizar notificação id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar notificação' });
    }
  },

  // Deletar notificação
  async deletarNotificacao(req, res) {
    const { id } = req.params;
    try {
      const notificacao = await Notification.findByPk(id);
      if (!notificacao) return res.status(404).json({ erro: 'Notificação não encontrada' });
      await notificacao.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao deletar notificação id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao deletar notificação' });
    }
  },
};

module.exports = NotificationController;
