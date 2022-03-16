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
exports.changePassword = exports.update = exports.show = void 0;
const authController_1 = require("./authController");
const User_1 = require("../schemas/User");
const config_1 = require("../config");
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ data: { user: req.user } });
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { name, email, phone, address } = req.body;
        let foundUser = yield User_1.User.findById(user.id);
        if (!foundUser) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
        foundUser.name = name;
        foundUser.email = email;
        foundUser.phone = phone;
        foundUser.address = address;
        if (req['file']) {
            foundUser.avatar = `${config_1.UPLOAD_DIR}/${req['file']['filename']}`;
        }
        yield foundUser.save();
        return res.status(200).json({ data: { user: foundUser } });
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при обновлении данных пользователя'
        });
    }
});
exports.update = update;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { newPassword, confirmNewPassword, oldPassword } = req.body;
        if (newPassword !== confirmNewPassword) {
            return res.status(402).json({
                message: 'Пароли не совпадают'
            });
        }
        const foundUser = yield User_1.User.findById(user.id).select('+password');
        if (!foundUser) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
        const passwordCorrect = yield foundUser.matchesPassword(oldPassword);
        if (!passwordCorrect) {
            return res.status(401).json({
                message: 'Текущий пароль некорректный'
            });
        }
        foundUser.password = newPassword;
        yield foundUser.save();
        (0, authController_1.sendResponseToken)({ user: foundUser, res, statusCode: 200 });
    }
    catch (e) {
        res.status(500).json({ message: 'Ошибка при смене пароля' });
    }
});
exports.changePassword = changePassword;
