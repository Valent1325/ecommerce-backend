"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../config");
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config_1.UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: fileStorage,
    fileFilter: fileFilter,
});
