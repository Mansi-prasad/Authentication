import express from "express";
import {
  LoginUser,
  logoutUser,
  myProfile,
  refreshCSRF,
  refreshToken,
  registerUser,
  verifyOtp,
  verifyUser,
} from "../controllers/user.controller";
import { isAuth } from "../middlewares/isAuth";
import { verifyCSRFToken } from "../middlewares/CSRFMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", LoginUser);
router.post("/verify", verifyOtp);
router.get("/me", isAuth, myProfile);
router.post("/refresh", refreshToken);
router.post("/logout", isAuth, verifyCSRFToken, logoutUser);
router.post("/refresh-csrf", isAuth, refreshCSRF);

export default router;
