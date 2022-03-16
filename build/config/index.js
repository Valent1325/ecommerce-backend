"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_DIR = exports.JWT_EPIRES_IN = exports.JWT_SECRET = exports.REDIS_URL = exports.DATABASE_URL = exports.SESSION_SECRET = exports.PORT = exports.IS_PROD = void 0;
exports.IS_PROD = process.env.NODE_ENV === 'production';
exports.PORT = process.env.PORT || 3000;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.REDIS_URL = process.env.REDIS_URL;
exports.JWT_SECRET = process.env.JWT_SECRET || '';
exports.JWT_EPIRES_IN = '7d';
exports.UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
