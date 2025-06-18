import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token =
      req?.headers?.authorization?.split(" ")[1] || req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Token de autenticação não encontrado!",
        error: true,
        success: false,
      });
    }

    // Verificação do token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    // Armazena o ID do usuário decodificado na requisição
    req.userId = decoded.id;
    req.role = decoded.role;
    req.email = decoded.email;
    next();
  } catch (error) {
    // Tratamento específico para diferentes tipos de erros
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Sessão expirada! Faça login novamente.",
        error: true,
        success: false,
        expired: true, // Informação adicional para o cliente
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido!",
        error: true,
        success: false,
      });
    }

    // Outros erros genéricos
    return res.status(401).json({
      message: "Falha na autenticação",
      error: true,
      success: false,
    });
  }
};

export default auth;
