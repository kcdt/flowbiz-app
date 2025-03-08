import express from 'express';
import { saleController } from '../controllers/sale.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createSaleSchema, updateSaleStatusSchema } from '../validation/sale.validation';
import { authMiddleware } from '../middleware/auth.middleware';
import { sellerOnly, adminSellerOnly } from '../middleware/role.middleware';
import { checkSaleOwner } from '../middleware/owner.middleware';

const router = express.Router();

// [POST] http://localhost:3000/sale
router.post('/', 
  authMiddleware, 
  sellerOnly, 
  validateRequest(createSaleSchema), 
saleController.createSale
);

// [GET] http://localhost:3000/sale
router.get('/', 
  authMiddleware, 
  sellerOnly, 
  saleController.getSales
);

// [GET] http://localhost:3000/sale/:id
router.get('/:id', 
  authMiddleware, 
  sellerOnly, 
  checkSaleOwner, 
  saleController.getSaleById
);

// [PATCH] http://localhost:3000/sale/:id
router.patch('/:id', 
  authMiddleware, 
  sellerOnly, 
  checkSaleOwner, 
  saleController.updateSale
);

// [PATCH] http://localhost:3000/sale/:id/status
router.patch('/:id/status', 
  authMiddleware, 
  sellerOnly, 
  checkSaleOwner, 
  validateRequest(updateSaleStatusSchema), 
  saleController.updateSaleStatus
);

// [DELETE] http://localhost:3000/sale/:id
router.delete('/:id', 
  authMiddleware, 
  adminSellerOnly, 
  checkSaleOwner, 
  saleController.deleteSale
);

export default router;