const { User } = require('../database/models');
const bcrypt = require('bcrypt');

const UserController = {
  // Listar usuários (exemplo, normalmente só admin acessa)
  async listarUsuarios(req, res) {
    try {
      const usuarios = await User.findAll({ attributes: { exclude: ['senhaHash'] } });
      return res.status(200).json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar usuários' });
    }
  },

  // Buscar usuário por ID
  async buscarUsuarioPorId(req, res) {
    const { id } = req.params;
    try {
      const usuario = await User.findByPk(id, { attributes: { exclude: ['senhaHash'] } });
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      return res.status(200).json(usuario);
    } catch (error) {
      console.error(`Erro ao buscar usuário id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao buscar usuário' });
    }
  },

  // Criar usuário com hash de senha
  async criarUsuario(req, res) {
    const { nome, email, senha, perfil } = req.body;
    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      const novoUsuario = await User.create({ nome, email, senhaHash, perfil });
      // Oculta a senhaHash no retorno
      const { senhaHash: _, ...usuarioSemSenha } = novoUsuario.toJSON();
      return res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ erro: 'Erro interno ao criar usuário' });
    }
  },

  // Atualizar usuário
  async atualizarUsuario(req, res) {
    const { id } = req.params;
    const { nome, email, senha, perfil } = req.body;
    try {
      const usuario = await User.findByPk(id);
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
      let senhaHash = usuario.senhaHash;

      if (senha) {
        senhaHash = await bcrypt.hash(senha, 10);
      }
      await usuario.update({ nome, email, senhaHash, perfil });
      const { senhaHash: _, ...usuarioSemSenha } = usuario.toJSON();
      return res.status(200).json(usuarioSemSenha);
    } catch (error) {
      console.error(`Erro ao atualizar usuário id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar usuário' });
    }
  },

  // Deletar usuário
  async deletarUsuario(req, res) {
    const { id } = req.params;
    try {
      const usuario = await User.findByPk(id);
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
      await usuario.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(`Erro ao deletar usuário id=${id}:`, error);
      return res.status(500).json({ erro: 'Erro interno ao deletar usuário' });
    }
  },
};

module.exports = UserController;
