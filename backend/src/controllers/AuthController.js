const { User } = require('../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthController = {
  // POST /api/auth/register - Registrar novo usuário
  async register(req, res) {
    const { nome, email, senha, perfil } = req.body;

    try {
      // Validação básica
      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
      }

      // Verifica se email já existe
      const usuarioExistente = await User.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Cria usuário
      const novoUsuario = await User.create({
        nome,
        email,
        senhaHash,
        perfil: perfil || 'usuario', // Padrão é 'usuario'
      });

      // Retorna usuário sem senha (SEM TOKEN) ⬅️ REMOVIDO O TOKEN
      const { senhaHash: _, ...usuarioSemSenha } = novoUsuario.toJSON();

      return res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        usuario: usuarioSemSenha,
        // ⬅️ REMOVIDO: token
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ erro: 'Erro interno ao registrar usuário' });
    }
  },

  // POST /api/auth/login - Login de usuário
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      // Validação básica
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      // Busca usuário por email
      const usuario = await User.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Verifica senha
      const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Gera token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Retorna usuário sem senha e com token
      const { senhaHash: _, ...usuarioSemSenha } = usuario.toJSON();

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso',
        usuario: usuarioSemSenha,
        token,
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ erro: 'Erro interno ao fazer login' });
    }
  },

  // GET /api/auth/me - Buscar usuário logado
  async me(req, res) {
    try {
      const { id } = req.usuario; // Vem do middleware de autenticação

      const usuario = await User.findByPk(id, {
        attributes: { exclude: ['senhaHash'] },
      });

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário logado:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar usuário' });
    }
  },
};

module.exports = AuthController;
