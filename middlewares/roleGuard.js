function roleGuard(...rolesPermitidos) {
    return (req, res, next) => {
      if (!req.user || !rolesPermitidos.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      next();
    };
  }
  
  module.exports = roleGuard;
  