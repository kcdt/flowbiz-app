import { Router } from 'express';
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { createUserSchema, loginSchema } from "../validation/user.validation";

const router = Router();

router.post("/register", validateRequest(createUserSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;