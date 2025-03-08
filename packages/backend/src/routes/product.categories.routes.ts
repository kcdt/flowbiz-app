import express from 'express';
import { categoryController } from '../controllers/product.categories.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// [GET] http://localhost:3000/api/product-categories
router.get('/', authMiddleware, categoryController.getAll);

// [GET] http://localhost:3000/api/product-categories/:id
router.get('/:id', authMiddleware, categoryController.getById);

// [POST] http://localhost:3000/api/product-categories
router.post('/', authMiddleware, categoryController.create);

// [PUT] http://localhost:3000/api/product-categories/:id
router.put('/:id', authMiddleware, categoryController.update);

// [DELETE] http://localhost:3000/api/product-categories/:id
router.delete('/:id', authMiddleware, categoryController.delete);

export default router;