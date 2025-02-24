import { Router } from 'express';
import { Request, Response } from 'express';

import productRoutes from "./product.routes";

const router = Router();

// http://localhost:3000/product
router.use('/product', productRoutes);

router.get('/', (req: Request, res: Response) => {
  res.send(`DB connectée`);
});

export default router;