import { Router } from "express";
import { createAdmin, login, verifyToken } from "../controllers/admin.controller.js";
const router = Router();

router.post("/login",login);
router.post("/register", createAdmin);
router.post("/verify-token",verifyToken);

export default router;
