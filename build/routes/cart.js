"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const cartController_1 = require("../controllers/cartController");
const validation_1 = require("../validation");
const router = (0, express_1.Router)();
exports.cartRouter = router;
router.use(auth_1.protect);
router
    .route('/')
    .get(cartController_1.index)
    .post((0, validation_1.addToCartValidation)(), validation_1.validate, cartController_1.store);
router.route('/clear').delete(cartController_1.clear);
router
    .route('/:productId')
    .put((0, validation_1.updateCartValidation)(), validation_1.validate, cartController_1.update)
    .delete((0, validation_1.deleteItemFromCartValidation)(), validation_1.validate, cartController_1.remove);
