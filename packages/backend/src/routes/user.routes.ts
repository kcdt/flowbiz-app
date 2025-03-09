import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { updateUserSchema } from "../validation/user.validation";
import { isAdminOrCurrentUser } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkUserCompany } from "../middleware/company.middleware";

const router = Router();

// [GET] http://localhost:3000/user/:id
router.get('/:id', 
  authMiddleware, 
  isAdminOrCurrentUser(), 
  checkUserCompany, 
  userController.getById
);

// [PATCH] http://localhost:3000/user/:id
router.patch('/:id', 
  authMiddleware, 
  validateRequest(updateUserSchema), 
  isAdminOrCurrentUser(), 
  checkUserCompany, 
  userController.update
);

// [DELETE] http://localhost:3000/user/:id
router.delete('/:id', 
  authMiddleware, 
  isAdminOrCurrentUser(), 
  checkUserCompany, 
  userController.delete
);

export default router;