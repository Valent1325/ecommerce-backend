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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = require("./database/mongoose");
const redis_1 = require("./database/redis");
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const filters_1 = require("./routes/filters");
const product_1 = require("./routes/product");
const cart_1 = require("./routes/cart");
const order_1 = require("./routes/order");
const config_1 = require("./config");
const checkSession_1 = require("./middleware/checkSession");
const Product_1 = require("./schemas/Product");
const validation_1 = require("./validation");
require('./lib/passport');
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
const app = (0, express_1.default)();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connectToMongoDB)();
    redis_1.redisClient.on('error', (err) => console.log('[Redis] Error:', err));
    redis_1.redisStoreClient.on('error', (err) => console.log('[Redis Session] Error:', err));
    redis_1.redisClient.on('connect', () => console.log('[Redis] Connected'));
    redis_1.redisStoreClient.on('error', (err) => console.log('[Redis Session] Error:', err));
    yield redis_1.redisClient.connect();
    yield redis_1.redisStoreClient.connect();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use((0, express_session_1.default)({
        store: new RedisStore({ client: redis_1.redisStoreClient }),
        secret: `${config_1.SESSION_SECRET}`,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: 3600 * 1000 * 3
        }
    }));
    app.use(passport_1.default.initialize());
    // Инициализация маршрутов
    app.use('/uploads', express_1.default.static(config_1.UPLOAD_DIR));
    app.use('/api/auth', auth_1.authRouter);
    app.use('/api/account', user_1.userRouter);
    app.use('/api/filters', filters_1.filtersRouter);
    app.use('/api/products', product_1.productRouter);
    app.use('/api/cart', cart_1.cartRouter);
    app.use('/api/orders', order_1.orderRouter);
    // Корзина без аутентификации
    app.get('/api/redis/cart', checkSession_1.checkSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const cartId = req.session['cartId'];
            let cartItems = [];
            const cartList = yield redis_1.redisClient.hGetAll(`cart:${cartId}`);
            if (!cartList) {
                return res.status(200).json({
                    data: null,
                });
            }
            for (const itemKey of Object.keys(cartList)) {
                const product = (_a = (yield Product_1.Product.findById(itemKey))) === null || _a === void 0 ? void 0 : _a.toJSON();
                if (product) {
                    cartItems.push({
                        quantity: parseInt(cartList[itemKey]),
                        product: product,
                    });
                }
            }
            return res.status(200).json({
                data: (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) ? {
                    items: cartItems,
                } : null,
            });
        }
        catch (e) {
            return res.status(500).json({
                message: 'Ошибка при получении корзины',
            });
        }
    }));
    app.post('/api/redis/cart', checkSession_1.checkSession, (0, validation_1.addToCartValidation)(), validation_1.validate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartId = req.session['cartId'];
            const { productId, quantity } = req.body;
            const product = yield Product_1.Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Продукт не найден'
                });
            }
            let quantityInCart = (yield redis_1.redisClient.hGet(`cart:${cartId}`, productId)) || 0;
            quantityInCart = typeof quantityInCart === 'string' ? parseInt(quantityInCart) : quantityInCart;
            yield redis_1.redisClient.hSet(`cart:${cartId}`, productId, quantityInCart + (quantity || 1));
            return res.sendStatus(201);
        }
        catch (e) {
            return res.status(500).json({
                message: 'Ошибка при создании корзины',
            });
        }
    }));
    app.put('/api/redis/cart/:productId', checkSession_1.checkSession, (0, validation_1.updateCartValidation)(), validation_1.validate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartId = req.session['cartId'];
            const { quantity } = req.body;
            const { productId } = req.params;
            const product = yield Product_1.Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Продукт не найден'
                });
            }
            const productInCart = yield redis_1.redisClient.hGet(`cart:${cartId}`, productId);
            if (!productInCart) {
                return res.status(404).json({
                    message: 'Продукт отсутствует в корзине'
                });
            }
            yield redis_1.redisClient.hSet(`cart:${cartId}`, productId, quantity);
            return res.sendStatus(200);
        }
        catch (e) {
            return res.status(500).json({
                message: 'Ошибка при создании корзины',
            });
        }
    }));
    app.delete('/api/redis/cart/clear', checkSession_1.checkSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartId = req.session['cartId'];
            const cartList = yield redis_1.redisClient.hGetAll(`cart:${cartId}`);
            if (!cartList) {
                return res.status(200).json({
                    data: null,
                });
            }
            for (const itemKey of Object.keys(cartList)) {
                yield redis_1.redisClient.hDel(`cart:${cartId}`, itemKey);
            }
            return res.sendStatus(204);
        }
        catch (e) {
            return res.status(500).json({
                message: 'Ошибка при очистке корзины',
            });
        }
    }));
    app.delete('/api/redis/cart/:productId', checkSession_1.checkSession, (0, validation_1.deleteItemFromCartValidation)(), validation_1.validate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartId = req.session['cartId'];
            const { productId } = req.params;
            const product = yield Product_1.Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Продукт не найден'
                });
            }
            const productInCart = yield redis_1.redisClient.hGet(`cart:${cartId}`, productId);
            if (!productInCart) {
                return res.status(404).json({
                    message: 'Продукт отсутствует в корзине'
                });
            }
            yield redis_1.redisClient.hDel(`cart:${cartId}`, productId);
            return res.sendStatus(204);
        }
        catch (e) {
            return res.status(500).json({
                message: 'Ошибка при удалении товара из корзины',
            });
        }
    }));
    app.listen(config_1.PORT, () => {
        console.log(`[Express] порт: ${config_1.PORT}`);
    });
});
start();
