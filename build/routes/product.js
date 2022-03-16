"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
exports.productRouter = router;
router.route('/').get(productController_1.index);
router.route('/:id').get(productController_1.show);
