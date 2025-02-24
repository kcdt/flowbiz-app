import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

// [POST] http://localhost:3000/user
router.post('/', userController.create);

// [GET] http://localhost:3000/user/:name
router.get('/', userController.getByName);

// [PATCH] http://localhost:3000/user/:id
router.patch('/:id', userController.update);

// [DELETE] http://localhost:3000/user/:id
router.delete('/:id', userController.delete);

export default router;