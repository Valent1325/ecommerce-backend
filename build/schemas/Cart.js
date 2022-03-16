"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const CartItemSchema = new mongoose_1.Schema({
    quantity: { type: mongoose_1.Schema.Types.Number, default: 1 },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false });
const CartSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    items: [CartItemSchema],
}, {
    timestamps: true,
    collection: 'carts',
    versionKey: false,
});
CartSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        var _a;
        delete ret._id;
        (_a = ret.items) === null || _a === void 0 ? void 0 : _a.forEach((item) => delete item._id);
    }
});
CartSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        var _a;
        delete ret._id;
        (_a = ret.items) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
            item.id = item._id;
            delete item._id;
        });
    }
});
exports.Cart = (0, mongoose_1.model)('Cart', CartSchema);
