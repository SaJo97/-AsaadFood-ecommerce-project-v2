import express from "express";
import {
  checkAuth,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  login,
  logout,
  refresh,
  register,
  updateUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import { verifyRoles, verifyToken } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";
import {
  handleValidationErrors,
  loginLimiter,
  loginValidation,
  registerLimiter,
  registerValidation,
} from "../lib/userValidation.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  registerValidation,
  handleValidationErrors,
  register,
); // registerLimiter, registerValidation, handleValidationErrors,
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  login,
); // loginLimiter, loginValidation, handleValidationErrors

router.get("/users", verifyToken, verifyRoles(ROLES.ADMIN), getAllUsers);
router.get("/users/:id", verifyToken, verifyRoles(ROLES.ADMIN), getUserById);

router.put("/users/:id", verifyToken, updateUser);
router.put(
  "/users/:id/role",
  verifyToken,
  verifyRoles(ROLES.ADMIN),
  updateUserRole,
);

router.delete("/users/:id", verifyToken, verifyRoles(ROLES.ADMIN), deleteUser);

router.get("/me", verifyToken, checkAuth); // fixa 401
router.get("/user/current", verifyToken, getCurrentUser); // fixa 401
// Logout route (clear cookie)
router.post("/logout", logout);
router.post("/refresh", refresh); // POST

export default router;
