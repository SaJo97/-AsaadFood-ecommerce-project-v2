import express from "express";

import {
  createNewProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import { verifyRoles, verifyToken } from "../middleware/auth.middleware.js";
import ROLES from "../constants/roles.js";

const router = express.Router();

router.get("", getAllProducts);
router.get("/:id", getProductById);

router.post("/", verifyToken, verifyRoles(ROLES.ADMIN), createNewProduct);

router.put("/:id", verifyToken, verifyRoles(ROLES.ADMIN), updateProduct);
router.delete("/:id", verifyToken, verifyRoles(ROLES.ADMIN), deleteProduct);

export default router;
