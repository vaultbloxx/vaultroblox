import express from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectedRoutes } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.get("/me", protectedRoutes, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", protectedRoutes, changePassword);

export default router;
