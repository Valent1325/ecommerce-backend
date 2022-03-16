"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, required: true },
    price: { type: mongoose_1.Schema.Types.Number, required: true },
    photo: { type: mongoose_1.Schema.Types.String, required: false },
    properties: {
        os: { type: mongoose_1.Schema.Types.String, required: false },
        cpu: { type: mongoose_1.Schema.Types.String, required: false },
        memory: { type: mongoose_1.Schema.Types.String, required: false },
        ram: { type: mongoose_1.Schema.Types.String, required: false },
        camera: { type: mongoose_1.Schema.Types.String, required: false },
        batery: { type: mongoose_1.Schema.Types.String, required: false },
        color: { type: mongoose_1.Schema.Types.String, required: false }
    }
}, {
    timestamps: true,
    collection: 'products',
    versionKey: false,
});
ProductSchema.index({
    name: 'text'
}, {
    weights: {
        name: 2,
    }
});
ProductSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
exports.Product = (0, mongoose_1.model)('Product', ProductSchema);
