const isAdmin = (req, res, next) => {
  try {
    if (!req.role) {
      return res.status(401).json({
        message: "Acesso negado. Role não encontrada.",
        error: true,
        success: false,
      });
    }
    if (req.role !== "ADMIN") {
      return res.status(403).json({
        message:
          "Acesso negado. Apenas administradores podem acessar este recurso.",
        error: true,
        success: false,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno do servidor",
      error: true,
      success: false,
    });
  }
};

export default isAdmin;
