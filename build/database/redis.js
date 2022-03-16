"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.redisStoreClient = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
exports.redisStoreClient = (0, redis_1.createClient)({
    url: `${config_1.REDIS_URL}`,
    legacyMode: true,
    database: 1,
});
exports.redisClient = (0, redis_1.createClient)({
    url: `${config_1.REDIS_URL}`,
    database: 2,
});
