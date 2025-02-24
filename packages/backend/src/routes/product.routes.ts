import { Router } from "express";
import { productController } from "../controllers/product.controller";

const router = Router();

// [POST] http://localhost:3000/product
router.post('/', productController.create);

// [GET] http://localhost:3000/product
router.get('/', productController.getAll);

// [GET] http://localhost:3000/product/:id
router.get('/:id', productController.getById);

// [PATCH] http://localhost:3000/product/:id
router.patch('/:id', productController.update);

// [DELETE] http://localhost:3000/product/:id
router.delete('/:id', productController.delete);

export default router;