import { Router, Request, Response } from 'express';
import productRoutes from './product.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import saleRoutes from './sale.routes';
import invoiceRoutes from './invoices.routes';

const router = Router();

// http://localhost:3000/auth
router.use('/auth', 
  authRoutes
);

// http://localhost:3000/user
router.use('/user', 
  userRoutes
);

// http://localhost:3000/product
router.use('/product', 
  productRoutes
);

// http://localhost:3000/sale
router.use('/sale', 
  saleRoutes
);

// http://localhost:3000/invoice
router.use('/invoice', 
  invoiceRoutes
);

router.get('/', (req: Request, res: Response) => {
  res.send(`DB connectée`);
});

export default router;