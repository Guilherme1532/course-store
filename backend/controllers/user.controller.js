import UserModel from "../models/user.model.js";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import bcrypt from "bcryptjs";
import generateRefreshToken from "../utils/generatedRefreshToken.js";
import generateAccessToken from "../utils/generatedAccessToken.js";
import uploadImageCloudnary from "../utils/uploadImageCloudnary.js";
import generateOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Os campos devem estar preenchidos",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.json({
        message: "O e-mail já está em uso",
        error: true,
        success: false,
      });
    }
    // Validar o formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "E-mail inválido",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verique seu e-mail",
      html: verifyEmailTemplate(payload.name, verifyEmailUrl),
    });

    return res.status(200).json({
      message: "Usuario registrado com sucesso",
      error: false,
      success: true,
      data: savedUser,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;
    

    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res.status(400).send({
        message: "Codigo não encontrado.",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      { _id: code },
      { verify_email: true }
    );

    return res.status(200).json({
      message: "Email verificado com sucesso.",
      error: false,
      success: true,
      data: {verify_email: updateUser.verify_email},
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: "Todos os campos devem ser preenchidos",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email não encontrado!",
        error: true,
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Senha incorreta!",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id, user.role, user.email);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    const updateUserLastLogin = await UserModel.updateOne(
      { _id: user._id },
      { last_login_date: Date.now() }
    );

    return res.status(200).json({
      message: "Usuario logado com sucesso!",
      error: false,
      success: true,
      data: {
        _id: user._id,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function googleLoginController(req, res) {
  try {
    const { emails, displayName } = req.user;
    const email = emails[0].value;
    const avatar = req.user.photos[0].value;
    let user = await UserModel.findOne({ email });
    if (!user) {
      const newUser = new UserModel({
        name: displayName,
        email: email,
        avatar: avatar,
        password: "",
        role: "USER",
        verify_email: true,
      });
      user = await newUser.save();
    }
    console.log("User found or created:", user);
    const accessToken = await generateAccessToken(user._id, user.role, user.email);
    const refreshToken = await generateRefreshToken(user._id);
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookiesOptions);
    res.cookie("refreshToken", refreshToken, cookiesOptions);
    const updateUserLastLogin = await UserModel.updateOne(
      { _id: user._id },
      { last_login_date: Date.now() }
    );
    const urlRedirect = `${process.env.FRONTEND_URL}/google-login?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    return res.redirect(urlRedirect)
  } catch (error) {
    console.error("Erro ao fazer login com o Google:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.clearCookie("accessToken", cookiesOptions);
    res.clearCookie("refreshToken", cookiesOptions);

    const removeRefreshToken = await UserModel.updateOne(
      { _id: userId },
      { refresh_token: "" }
    );

    return res.status(200).json({
      message: "Logout realizado com sucesso",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getUserDetails(req, res) {
  try{
    const userId = req.userId;

    const user = await UserModel.findById(userId).select("-password -refresh_token -forgot_password_otp -forgot_password_otp_time");
    if(!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Detalhes do usuário",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;
    const image = req.file;
    const upload = await uploadImageCloudnary(image);
    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.status(200).json({
      message: "Avatar atualizado com sucesso",
      error: false,
      success: true,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;
    const { name, email, password, mobile } = req.body;

    let hashPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );

    return res.status(200).json({
      message: "Usuario atualizado com sucesso",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "E-mail não encontrado",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date() + 30 * 60 * 1000; // 30 minutes

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_otp_time: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Redefinição de senha",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.status(200).json({
      message: "Cheque e-mail para redefinir sua senha",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Todos os campos devem ser preenchidos",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "E-mail não encontrado",
        error: true,
        success: false,
      });
    }
    const currentTime = new Date().toISOString();
    if (user.forgot_password_otp_time < currentTime) {
      return res.status(400).json({
        message: "OTP expirado",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "OTP inválido",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: "",
      forgot_password_otp_time: "",
    });

    return res.status(200).json({
      message: "OTP verificado com sucesso",
      error: false,
      success: true,
    });
  } catch {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Todos os campos devem ser preenchidos",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "E-mail não encontrado",
        error: true,
        success: false,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "As senhas não coincidem",
        error: true,
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Senha redefinida com sucesso",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token não encontrado",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return res.status(401).json({
        message: "Token expirado",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?.id;
    const user = await UserModel.findById(userId)
    if(!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
        error: true,
        success: false,
      });
    }
    const newAccessToken = await generateAccessToken(userId, user.role, user.email);
    
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", newAccessToken, cookiesOptions);
    res.cookie("refreshToken", refreshToken, cookiesOptions);

    return res.status(200).json({
      message: "Novo token de acesso gerado com sucesso",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
        error: true,
        success: false,
      });
    }

    const deleteUser = await UserModel.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({
        message: "Usuário não encontrado",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Usuário deletado com sucesso",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
