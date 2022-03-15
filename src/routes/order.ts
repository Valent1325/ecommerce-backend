import { Router } from 'express';

import { protect } from '../middleware/auth';

import { index, store } from '../controllers/orderController';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(index)
  .post(store);

export { router as orderRouter };
