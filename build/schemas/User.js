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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, required: true },
    email: { type: mongoose_1.Schema.Types.String, required: true, unique: true, index: true },
    avatar: { type: mongoose_1.Schema.Types.String, required: false },
    phone: { type: mongoose_1.Schema.Types.String, required: false },
    address: { type: mongoose_1.Schema.Types.String, required: false },
    password: mongoose_1.Schema.Types.String,
}, {
    timestamps: true,
    collection: 'users',
    versionKey: false,
});
UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});
// Хэширование пароля
UserSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            if (this.password) {
                const hash = yield bcryptjs_1.default.hashSync(this.password.toString(), 10);
                this.password = hash;
            }
        }
    });
});
// Сравнение паролей
UserSchema.methods.matchesPassword = function (password) {
    if (!this.password) {
        return false;
    }
    return bcryptjs_1.default.compareSync(password, this.password);
};
exports.User = (0, mongoose_1.model)('User', UserSchema);
