import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { NewProductSchema, ProductSchema } from "../validation/product.validation";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkProductOwner } from "../middleware/owner.middleware";
import { adminSellerOnly } from "../middleware/role.middleware";

const router = Router();

// [POST] http://localhost:3000/product
router.post('/', validateRequest(NewProductSchema), authMiddleware, productController.create);

// [GET] http://localhost:3000/product
router.get('/', authMiddleware, checkProductOwner, productController.getAll);

// [GET] http://localhost:3000/product/:id
router.get('/:id', authMiddleware, checkProductOwner, productController.getById);

// [PATCH] http://localhost:3000/product/:id
router.patch('/:id', validateRequest(ProductSchema), authMiddleware, adminSellerOnly, checkProductOwner, productController.update);

// [DELETE] http://localhost:3000/product/:id
router.delete('/:id', authMiddleware, checkProductOwner, adminSellerOnly, productController.delete);

export default router;