import { Router } from "express";
import {
  registerUserController,
  loginController,
  verifyEmailController,
  logoutController,
  uploadAvatar,
  updateUserDetails,
  forgotPasswordController,
  verifyForgotPasswordOtp,
  resetPassword,
  refreshToken,
  getUserDetails,
  deleteUser
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import isAdmin from "../middlewares/isAdmin.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.put("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
userRouter.put("/update-user", auth, updateUserDetails);
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordOtp);
userRouter.put("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/get-user-details", auth, getUserDetails);
userRouter.delete("/delete-user", auth, isAdmin, deleteUser);

export default userRouter;
