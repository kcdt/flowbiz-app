import { Router } from 'express';
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { registerSchema, loginSchema } from "../validation/user.validation";
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// [GET] http://localhost:3000/auth/me
router.get('/me', 
  authMiddleware, 
  authController.getMe
);

// [POST] http://localhost:3000/auth/register
router.post("/register", 
  validateRequest(registerSchema), 
  authController.register
);

// [POST] http://localhost:3000/auth/login
router.post("/login", 
  validateRequest(loginSchema), 
  authController.login
);

// [POST] http://localhost:3000/auth/logout
router.post("/logout", 
  authController.logout
);

// [POST] http://localhost:3000/auth/refresh-token
router.post("/refresh-token", 
  authController.refreshToken
);

export default router;