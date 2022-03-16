"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.remove = exports.update = exports.store = exports.index = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Cart_1 = require("../schemas/Cart");
const Product_1 = require("../schemas/Product");
const { ObjectId } = mongoose_1.default.Types;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const cart = yield Cart_1.Cart.findOne({ user: user.id })
            .populate('items.product');
        return res.status(200).json({
            data: cart,
        });
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при получении корзины пользователя',
        });
    }
});
exports.index = index;
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const { productId, quantity } = req.body;
        const product = yield Product_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Продукт не найден'
            });
        }
        let cart = yield Cart_1.Cart.findOne({ user: user.id });
        if (cart) {
            const productExists = (_a = cart === null || cart === void 0 ? void 0 : cart.items) === null || _a === void 0 ? void 0 : _a.some((item) => new ObjectId(productId).equals(item.product));
            if (productExists) {
                cart = yield Cart_1.Cart.findOneAndUpdate({ _id: cart.id, 'items.product': productId }, { $inc: { 'items.$.quantity': quantity || 1 } }, { new: false });
            }
            else {
                cart = yield Cart_1.Cart.findOneAndUpdate({ _id: cart.id }, { $addToSet: { items: { quantity: quantity || 1, product: productId } } }, { new: true });
            }
            return res.sendStatus(200);
        }
        else {
            cart = yield Cart_1.Cart.create({
                user: user.id,
                items: [{ quantity: quantity || 1, product: productId }],
            });
            cart = yield Cart_1.Cart.findOne({ user: user.id }).populate('items.product');
            return res.status(201).json({
                data: cart,
            });
        }
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при создании корзины пользователя',
        });
    }
});
exports.store = store;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { quantity } = req.body;
        const { productId } = req.params;
        const product = yield Product_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Продукт не найден'
            });
        }
        const cart = yield Cart_1.Cart.findOneAndUpdate({ user: user.id, 'items.product': productId }, { $set: { 'items.$.quantity': quantity } }, { new: false });
        if (!cart) {
            return res.status(404).json({
                message: 'Корзина пользователя не найдена',
            });
        }
        return res.sendStatus(200);
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при обновлении корзины пользователя',
        });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { productId } = req.params;
        const product = yield Product_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Продукт не найден'
            });
        }
        const cart = yield Cart_1.Cart.findOneAndUpdate({ user: user.id, 'items.product': productId }, { $pull: { items: { product: productId } } }, { new: true });
        if (!cart) {
            return res.status(404).json({
                message: 'Корзина пользователя не найдена',
            });
        }
        return res.sendStatus(204);
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при удалении товара из корзины пользователя',
        });
    }
});
exports.remove = remove;
const clear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const cart = yield Cart_1.Cart.findOneAndDelete({ user: user.id });
        if (!cart) {
            return res.status(404).json({
                message: 'Корзина пользователя не найдена',
            });
        }
        return res.sendStatus(204);
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при очистке корзины пользователя',
        });
    }
});
exports.clear = clear;
