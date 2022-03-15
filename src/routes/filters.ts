import { Router } from 'express';

import { index } from '../controllers/filtersController';

const router = Router();

router.route('/').get(index);

export { router as filtersRouter };
