"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const passport_1 = __importDefault(require("passport"));
const protect = (req, res, next) => {
    return passport_1.default.authenticate('jwt', { session: false }, function (err, user, info) {
        if (err) {
            return next(info);
        }
        if (!user) {
            return res.status(401).json({
                message: 'Необходима авторизация',
            });
        }
        req.user = user;
        return next();
    })(req, res, next);
};
exports.protect = protect;
