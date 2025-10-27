const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        erro: 'Dados inválidos', 
        detalhes: error.details.map(d => d.message) 
      });
    }
    
    next();
  };
};

module.exports = validateMiddleware;
