import { Router } from 'express';
import { Request, Response } from 'express';
import productRoutes from "./product.routes";
import userRoutes from "./user.routes";

const router = Router();

// http://localhost:3000/user
router.use('/user', userRoutes);

// http://localhost:3000/product
router.use('/product', productRoutes);

router.get('/', (req: Request, res: Response) => {
  res.send(`DB connectée`);
});

export default router;