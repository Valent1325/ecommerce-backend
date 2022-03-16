"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
exports.orderRouter = router;
router.use(auth_1.protect);
router
    .route('/')
    .get(orderController_1.index)
    .post(orderController_1.store);
