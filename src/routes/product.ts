import { Router } from 'express';

import { index, show } from '../controllers/productController';

const router = Router();

router.route('/').get(index);
router.route('/:id').get(show);

export { router as productRouter };
