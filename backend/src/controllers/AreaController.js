const { Area } = require('../database/models');

const AreaController = {
  // Listar todas as áreas
  async listarAreas(req, res) {
    try {
      const areas = await Area.findAll();
      return res.status(200).json(areas);
    } catch (error) {
      console.error('Erro ao listar áreas:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar áreas' });
    }
  },

  // Buscar área pelo ID
  async buscarAreaPorId(req, res) {
    const { id } = req.params;
    try {
      const area = await Area.findByPk(id);
      if (!area) {
        return res.status(404).json({ erro: 'Área não encontrada' });
      }
      return res.status(200).json(area);
    } catch (error) {
      console.error(`Erro ao buscar área id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao buscar área' });
    }
  },

  // Criar nova área
  async criarArea(req, res) {
    const { nome, descricao, coordenadas, status_risco } = req.body;
    try {
      const novaArea = await Area.create({ nome, descricao, coordenadas, status_risco });
      return res.status(201).json(novaArea);
    } catch (error) {
      console.error('Erro ao criar área:', error);
      return res.status(500).json({ erro: 'Erro interno ao criar área' });
    }
  },

  // Atualizar área existente
  async atualizarArea(req, res) {
    const { id } = req.params;
    const { nome, descricao, coordenadas, status_risco } = req.body;
    try {
      const area = await Area.findByPk(id);
      if (!area) {
        return res.status(404).json({ erro: 'Área não encontrada' });
      }
      await area.update({ nome, descricao, coordenadas, status_risco });
      return res.status(200).json(area);
    } catch (error) {
      console.error(`Erro ao atualizar área id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar área' });
    }
  },

  // Deletar área
  async deletarArea(req, res) {
    const { id } = req.params;
    try {
      const area = await Area.findByPk(id);
      if (!area) {
        return res.status(404).json({ erro: 'Área não encontrada' });
      }
      await area.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao deletar área id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao deletar área' });
    }
  },
};

module.exports = AreaController;
