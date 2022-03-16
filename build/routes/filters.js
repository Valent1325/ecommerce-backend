"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtersRouter = void 0;
const express_1 = require("express");
const filtersController_1 = require("../controllers/filtersController");
const router = (0, express_1.Router)();
exports.filtersRouter = router;
router.route('/').get(filtersController_1.index);
