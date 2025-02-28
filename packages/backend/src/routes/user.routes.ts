import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { updateUserSchema } from "../validation/user.validation";
import { adminSellerOnly } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// [GET] http://localhost:3000/user/:id
router.get('/:id', authMiddleware, adminSellerOnly, userController.getById);

// [PATCH] http://localhost:3000/user/:id
router.patch('/:id', authMiddleware, validateRequest(updateUserSchema), adminSellerOnly, userController.update);

// [DELETE] http://localhost:3000/user/
router.delete('/:id', authMiddleware, adminSellerOnly, userController.delete);

export default router;