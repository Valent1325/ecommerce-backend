"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemFromCartValidation = exports.updateCartValidation = exports.addToCartValidation = exports.changePasswordValidation = exports.signUpValidation = exports.loginValidation = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().forEach((error) => extractedErrors.push({ [error.param]: error.msg }));
    return res.status(422).json({
        message: 'Данные невалидные',
        errors: extractedErrors,
    });
};
exports.validate = validate;
const loginValidation = () => {
    return [
        (0, express_validator_1.body)('email')
            .isEmail()
            .withMessage('Email адрес невалидный')
            .trim()
            .escape(),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6 })
            .withMessage('Пароль должен быть длинной минимум в 6 символов')
            .trim()
            .escape(),
    ];
};
exports.loginValidation = loginValidation;
const signUpValidation = () => {
    return [
        (0, express_validator_1.body)('name')
            .isLength({ min: 6 })
            .withMessage('Имя пользователя должно быть длинной минимум в 6 символов')
            .trim()
            .escape(),
        (0, express_validator_1.body)('email')
            .isEmail()
            .withMessage('Email адрес невалидный')
            .trim()
            .escape(),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6 })
            .withMessage('Пароль должен быть длинной минимум в 6 символов')
            .trim()
            .escape(),
    ];
};
exports.signUpValidation = signUpValidation;
const changePasswordValidation = () => {
    return [
        (0, express_validator_1.body)('newPassword')
            .isLength({ min: 6 })
            .withMessage('Новый пароль должен быть длинной минимум в 6 символов')
            .trim()
            .escape(),
        (0, express_validator_1.body)('confirmNewPassword')
            .isLength({ min: 6 })
            .withMessage('Новый пароль должен быть длинной минимум в 6 символов')
            .trim()
            .escape(),
        (0, express_validator_1.body)('oldPassword')
            .isLength({ min: 6 })
            .withMessage('Пароль должен быть длинной минимум в 6 символов')
            .trim()
            .escape(),
    ];
};
exports.changePasswordValidation = changePasswordValidation;
const addToCartValidation = () => {
    return [
        (0, express_validator_1.body)('productId')
            .notEmpty()
            .isMongoId()
            .withMessage('Товар не найден'),
    ];
};
exports.addToCartValidation = addToCartValidation;
const updateCartValidation = () => {
    return [
        (0, express_validator_1.param)('productId')
            .notEmpty()
            .isMongoId()
            .withMessage('Товар не найден'),
        (0, express_validator_1.body)('quantity')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Количество товара должно быть больше 0'),
    ];
};
exports.updateCartValidation = updateCartValidation;
const deleteItemFromCartValidation = () => {
    return [
        (0, express_validator_1.param)('productId')
            .notEmpty()
            .isMongoId()
            .withMessage('Товар не найден'),
    ];
};
exports.deleteItemFromCartValidation = deleteItemFromCartValidation;
