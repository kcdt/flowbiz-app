import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { createUserSchema, updateUserSchema } from "../validation/user.validation";

const router = Router();

// [POST] http://localhost:3000/user
router.post('/', (req, res, next) => validateRequest(createUserSchema, req, res, next), userController.create);

// [GET] http://localhost:3000/user/:id
router.get('/:id', userController.getById);

// [GET] http://localhost:3000/user/:id/products
router.get('/:id/products', userController.getUserProducts);

// [PATCH] http://localhost:3000/user/:id
router.patch('/:id', (req, res, next) => validateRequest(updateUserSchema, req, res, next), userController.update);

// [DELETE] http://localhost:3000/user/:id
router.delete('/:id', userController.delete);

export default router;