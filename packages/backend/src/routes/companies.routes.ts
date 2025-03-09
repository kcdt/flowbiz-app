import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkCanAccessCompany } from "../middleware/company.middleware";
import { companyController } from "../controllers/companies.controller";

const router = Router();

// [GET] http://localhost:3000/company/:id
router.get('/:id', 
  authMiddleware, 
  checkCanAccessCompany, 
  companyController.getById
);

export default router;