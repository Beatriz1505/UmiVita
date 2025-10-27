const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Adiciona dados do usuário no req
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
