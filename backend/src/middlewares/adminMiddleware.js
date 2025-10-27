const adminMiddleware = (req, res, next) => {
  const { perfil } = req.usuario; // Vem do authMiddleware

  if (perfil !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
  }

  next();
};

module.exports = adminMiddleware;
