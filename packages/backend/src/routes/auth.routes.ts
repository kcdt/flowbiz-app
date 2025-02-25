import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { createUserSchema, loginSchema } from "../validation/user.validation";

const router = Router();

router.post("/register", (req, res, next) => validateRequest(createUserSchema, req, res, next), AuthController.register);
router.post("/login", (req, res, next) => validateRequest(loginSchema, req, res, next), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);

export default router;