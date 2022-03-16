"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../lib/multer");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../validation");
const router = (0, express_1.Router)();
exports.userRouter = router;
router.use(auth_1.protect);
router.route('/')
    .get(userController_1.show)
    .put(multer_1.upload.single('avatar'), userController_1.update);
router.route('/change-password').patch((0, validation_1.changePasswordValidation)(), validation_1.validate, userController_1.changePassword);
