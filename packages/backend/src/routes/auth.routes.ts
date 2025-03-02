import { Router } from 'express';
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { createUserSchema, loginSchema } from "../validation/user.validation";

const router = Router();

// [POST] http://localhost:3000/register
router.post("/register", 
  validateRequest(createUserSchema), 
  authController.register
);

// [POST] http://localhost:3000/login
router.post("/login", 
  validateRequest(loginSchema), 
  authController.login
);

// [POST] http://localhost:3000/logout
router.post("/logout", 
  authController.logout
);

// [POST] http://localhost:3000/refresh-token
router.post("/refresh-token", 
  authController.refreshToken
);

export default router;