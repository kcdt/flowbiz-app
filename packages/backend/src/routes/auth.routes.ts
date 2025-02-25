import { Router } from 'express';
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { createUserSchema, loginSchema } from "../validation/user.validation";

const router = Router();

router.post("/register", (req, res, next) => validateRequest(createUserSchema, req, res, next), authController.register);
router.post("/login", (req, res, next) => validateRequest(loginSchema, req, res, next), authController.login);
router.post("/refresh-token", authController.refreshToken);

export default router;