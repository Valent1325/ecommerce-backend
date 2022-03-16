"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSession = void 0;
const nanoid_1 = require("nanoid");
const checkSession = (req, res, next) => {
    if (req.session && req.session.cartId) {
        return next();
    }
    req.session.cartId = (0, nanoid_1.nanoid)(16);
    return next();
};
exports.checkSession = checkSession;
