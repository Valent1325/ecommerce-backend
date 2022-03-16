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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const User_1 = require("../schemas/User");
const config_1 = require("../config");
passport_1.default.use('login', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            return done(null, false, {
                message: 'Пользователь с данным Email адресом не найден',
            });
        }
        const matches = yield user.matchesPassword(password);
        if (!matches) {
            return done(null, false, {
                message: 'Неверный пароль',
            });
        }
        return done(null, user, {
            message: 'Успешная аутентификация пользователя',
        });
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.use('signUp', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        let user = yield User_1.User.findOne({ email });
        if (user) {
            return done(null, false, {
                message: 'Пользователь уже существует'
            });
        }
        user = yield User_1.User.create({
            email,
            password,
            name,
        });
        return done(null, user, {
            message: 'Пользователь успешно добавлен'
        });
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: config_1.JWT_SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = token;
        const user = yield User_1.User.findById(id);
        if (!user) {
            return done(null, false, {
                message: 'Пользователь не найден',
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
