import { Router } from 'express';

import { protect } from '../middleware/auth';

import { upload } from '../lib/multer';

import { changePassword, show, update } from '../controllers/userController';

import { changePasswordValidation, validate } from '../validation';

const router = Router();

router.use(protect);

router.route('/')
  .get(show)
  .put(upload.single('avatar'), update);
router.route('/change-password').patch(changePasswordValidation(), validate, changePassword);

export { router as userRouter };
