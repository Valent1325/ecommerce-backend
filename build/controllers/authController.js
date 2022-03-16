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
exports.signUp = exports.login = exports.sendResponseToken = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const sendResponseToken = ({ user, res, statusCode, }) => {
    const payload = {
        id: user.id,
    };
    const token = jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET, {
        expiresIn: config_1.JWT_EPIRES_IN,
    });
    user.password = undefined;
    res.status(statusCode).json({ success: true, data: { user, token } });
};
exports.sendResponseToken = sendResponseToken;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('login', { session: false }, function (error, user, info) {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        return (0, exports.sendResponseToken)({ user, res, statusCode: 200 });
    })(req, res, next);
});
exports.login = login;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('signUp', { session: false }, function (error, user, info) {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        return (0, exports.sendResponseToken)({ user, res, statusCode: 201 });
    })(req, res, next);
});
exports.signUp = signUp;
