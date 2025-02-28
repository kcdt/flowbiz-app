import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { updateUserSchema } from "../validation/user.validation";

const router = Router();

// [GET] http://localhost:3000/user/:id
router.get('/:id', userController.getById);

// [PATCH] http://localhost:3000/user/:id
router.patch('/:id', validateRequest(updateUserSchema), userController.update);

// [DELETE] http://localhost:3000/user/:id
router.delete('/:id', userController.delete);

export default router;