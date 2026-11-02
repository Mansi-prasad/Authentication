import express from "express";
import {
  LoginUser,
  logoutUser,
  myProfile,
  refreshCSRF,
  refreshToken,
  registerUser,
  resendOtp,
  verifyOtp,
  verifyUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
import { verifyCSRFToken } from "../middlewares/CSRFMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", LoginUser);
router.post("/verify", verifyOtp);
router.post("/send-otp", resendOtp);
router.get("/me", isAuth, myProfile);
router.post("/refresh", refreshToken);
router.post("/logout", isAuth, verifyCSRFToken, logoutUser);
router.post("/refresh-csrf", isAuth, refreshCSRF);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
