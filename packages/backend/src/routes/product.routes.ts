import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { NewProductSchema, EditProductSchema } from "../validation/product.validation";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkProductOwner } from "../middleware/owner.middleware";
import { adminSellerOnly } from "../middleware/role.middleware";

const router = Router();

// [POST] http://localhost:3000/products
router.post('/', 
  validateRequest(NewProductSchema), 
  authMiddleware, 
  productController.create
);

// [GET] http://localhost:3000/products
router.get('/', 
  authMiddleware, 
  productController.getAll
);

// [GET] http://localhost:3000/products/:id
router.get('/:id', 
  authMiddleware, 
  checkProductOwner, 
  productController.getById
);

// [PUT] http://localhost:3000/products/:id
router.put('/:id',
  validateRequest(EditProductSchema), 
  authMiddleware, 
  adminSellerOnly, 
  checkProductOwner, 
  productController.update
);

// [DELETE] http://localhost:3000/products/:id
router.delete('/:id', 
  authMiddleware, 
  adminSellerOnly, 
  checkProductOwner, 
  productController.delete
);

export default router;