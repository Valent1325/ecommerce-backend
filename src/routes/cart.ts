import { Router } from 'express';

import { protect } from '../middleware/auth';

import { index, store, update, remove, clear } from '../controllers/cartController';

import { addToCartValidation, deleteItemFromCartValidation, updateCartValidation, validate } from '../validation';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(index)
  .post(addToCartValidation(), validate, store);

router.route('/clear').delete(clear);

router
  .route('/:productId')
  .put(updateCartValidation(), validate, update)
  .delete(deleteItemFromCartValidation(), validate, remove);

export { router as cartRouter };
