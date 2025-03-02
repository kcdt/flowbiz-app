import { Router } from "express";
import { invoicesController } from "../controllers/invoices.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkInvoiceOwner } from "../middleware/owner.middleware";
import { adminSellerOnly } from "../middleware/role.middleware";
import { createInvoiceSchema, updateInvoiceStatusSchema } from "../validation/invoices.validation";

const router = Router();

// [GET] http://localhost:3000/invoice
router.get('/', 
  authMiddleware,
  invoicesController.getAll
);

// [POST] http://localhost:3000/invoice
router.post('/',
  authMiddleware,
  validateRequest(createInvoiceSchema),
  invoicesController.create
);

// [GET] http://localhost:3000/invoice/:id
router.get('/:id', 
  authMiddleware,
  checkInvoiceOwner,
  invoicesController.getById
);

// [GET] http://localhost:3000/invoice/:id/pdf
router.get('/:id/pdf', 
  authMiddleware, 
  checkInvoiceOwner,
  invoicesController.generatePDF
);

// [PATCH] http://localhost:3000/invoice/:id
router.patch('/:id/status', 
  authMiddleware,
  checkInvoiceOwner,
  validateRequest(updateInvoiceStatusSchema),
  invoicesController.updateStatus
);

// [PATCH] http://localhost:3000/invoice/:id/delete
router.patch('/:id/delete', 
  authMiddleware,
  adminSellerOnly,
  invoicesController.delete
);

export default router;