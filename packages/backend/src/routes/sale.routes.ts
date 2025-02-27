import express from 'express';
import { saleController } from '../controllers/sale.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createSaleSchema, updateSaleStatusSchema } from '../validation/sale.validation';
import { authMiddleware } from '../middleware/auth.middleware';
import { sellerOnly, adminSellerOnly } from '../middleware/role.middleware';
import { checkSaleOwner } from '../middleware/owner.middleware';

const router = express.Router();

router.post('/', authMiddleware, sellerOnly, validateRequest(createSaleSchema), saleController.createSale);
router.get('/', authMiddleware, sellerOnly, saleController.getSales);
router.get('/:id', authMiddleware, sellerOnly, checkSaleOwner, saleController.getSaleById);
router.patch('/:id/status', authMiddleware, sellerOnly, checkSaleOwner, validateRequest(updateSaleStatusSchema), saleController.updateSaleStatus);
router.delete('/:id', authMiddleware, adminSellerOnly, checkSaleOwner, saleController.deleteSale);

export default router;