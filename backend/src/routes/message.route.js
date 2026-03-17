import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { optionalVerifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalVerifyToken, sendMessage);

export default router;
