"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const Order_1 = require("../models/Order");
const OrderItemSchema = new mongoose_1.Schema({
    quantity: { type: mongoose_1.Schema.Types.Number, default: 1 },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema],
    total: mongoose_1.Schema.Types.Number,
    status: { type: mongoose_1.Schema.Types.String, enum: Order_1.OrderStatus, default: Order_1.OrderStatus.CREATED },
    paymentMethod: { type: mongoose_1.Schema.Types.String, required: true },
    deliveryMethod: { type: mongoose_1.Schema.Types.String, required: true },
}, {
    timestamps: true,
    collection: 'orders',
    versionKey: false,
});
OrderSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        var _a;
        delete ret._id;
        (_a = ret.items) === null || _a === void 0 ? void 0 : _a.forEach((item) => delete item._id);
    }
});
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
