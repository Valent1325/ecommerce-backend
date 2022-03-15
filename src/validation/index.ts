import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: Object[] = [];
  errors.array().forEach((error) => extractedErrors.push({ [error.param]: error.msg }));

  return res.status(422).json({
    message: 'Данные невалидные',
    errors: extractedErrors,
  });
};

export const loginValidation = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Email адрес невалидный')
      .trim()
      .escape(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Пароль должен быть длинной минимум в 6 символов')
      .trim()
      .escape(),
  ];
};

export const signUpValidation = () => {
  return [
    body('name')
      .isLength({ min: 6 })
      .withMessage('Имя пользователя должно быть длинной минимум в 6 символов')
      .trim()
      .escape(),
    body('email')
      .isEmail()
      .withMessage('Email адрес невалидный')
      .trim()
      .escape(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Пароль должен быть длинной минимум в 6 символов')
      .trim()
      .escape(),
  ];
};

export const changePasswordValidation = () => {
  return [
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Новый пароль должен быть длинной минимум в 6 символов')
      .trim()
      .escape(),
    body('confirmNewPassword')
      .isLength({ min: 6 })
      .withMessage('Новый пароль должен быть длинной минимум в 6 символов')
      .trim()
      .escape(),
    body('oldPassword')
      .isLength({ min: 6 })
      .withMessage('Пароль должен быть длинной минимум в 6 символов')
      .trim()
      .escape(),
  ];
}

export const addToCartValidation = () => {
  return [
    body('productId')
      .notEmpty()
      .isMongoId()
      .withMessage('Товар не найден'),
  ];
};

export const updateCartValidation = () => {
  return [
    param('productId')
      .notEmpty()
      .isMongoId()
      .withMessage('Товар не найден'),
    body('quantity')
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('Количество товара должно быть больше 0'),
  ];
};

export const deleteItemFromCartValidation = () => {
  return [
    param('productId')
      .notEmpty()
      .isMongoId()
      .withMessage('Товар не найден'),
  ];
}
