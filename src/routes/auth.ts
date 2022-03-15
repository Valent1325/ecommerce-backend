import { Router } from 'express';

import { login, signUp } from '../controllers/authController';

import { loginValidation, signUpValidation, validate } from '../validation';

const router = Router();

router.route('/login').post(loginValidation(), validate, login);
router.route('/signup').post(signUpValidation(), validate, signUp);

export { router as authRouter };
