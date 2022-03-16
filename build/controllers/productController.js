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
exports.show = exports.index = void 0;
const Product_1 = require("../schemas/Product");
const ModelQuery_1 = __importDefault(require("../utils/ModelQuery"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const models = new ModelQuery_1.default(Product_1.Product.find(), Product_1.Product, req.query)
            .filter()
            .sort()
            .paginate();
        const products = yield models.query;
        const total = yield models.count().total;
        return res.status(200).json({ data: { total, products } });
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при получении информации по всем продуктам'
        });
    }
});
exports.index = index;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Product_1.Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: 'Продукт не найден'
            });
        }
        return res.status(200).json({ data: { product } });
    }
    catch (e) {
        return res.status(500).json({
            message: 'Ошибка при получении информации по продукту'
        });
    }
});
exports.show = show;
