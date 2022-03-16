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
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.index = void 0;
const Cart_1 = require("../schemas/Cart");
const Order_1 = require("../schemas/Order");
const Order_2 = require("../models/Order");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const orders = yield Order_1.Order.find({ user: user.id })
            .populate('items.product')
            .sort('-createdAt');
        return res.status(200).json({
            data: orders,
        });
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при получении списка заказов пользователя',
        });
    }
});
exports.index = index;
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const user = req.user;
        const { paymentMethod, deliveryMethod } = req.body;
        let cart = (_a = (yield Cart_1.Cart.findOne({ user: user.id }).populate('items.product'))) === null || _a === void 0 ? void 0 : _a.toObject();
        if (!cart) {
            return res.status(404).json({
                message: 'Корзина пользователя не найдена'
            });
        }
        const total = (_b = cart === null || cart === void 0 ? void 0 : cart.items) === null || _b === void 0 ? void 0 : _b.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        const items = (_c = cart.items) === null || _c === void 0 ? void 0 : _c.map((item) => ({ quantity: item.quantity, product: item.product['_id'] }));
        const newOrder = new Order_1.Order({
            user: user.id,
            items,
            total,
            status: Order_2.OrderStatus.CREATED,
            paymentMethod,
            deliveryMethod,
        });
        const { _id } = yield newOrder.save();
        yield Cart_1.Cart.findOneAndDelete({ user: user.id });
        const order = yield Order_1.Order.findById(_id).populate('items.product');
        return res.status(200).json({
            data: order,
        });
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при формировании заказа пользователя',
        });
    }
});
exports.store = store;
