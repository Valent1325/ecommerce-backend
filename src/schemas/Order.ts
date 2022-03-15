import { Schema, Document, model } from 'mongoose';

import { ProductDocument } from './Product';
import { UserDocument } from './User';

import { OrderStatus } from '../models/Order';

export interface OrderItem {
  quantity: number;
  product: ProductDocument['_id'];
}

export interface OrderDocument extends Document {
  user: UserDocument['_id'];
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryMethod: string;
}

const OrderItemSchema = new Schema({
  quantity: { type: Schema.Types.Number, default: 1 },
  product: { type: Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false });

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  total: Schema.Types.Number,
  status: { type: Schema.Types.String, enum: OrderStatus, default: OrderStatus.CREATED },
  paymentMethod: { type: Schema.Types.String, required: true },
  deliveryMethod: { type: Schema.Types.String, required: true },
}, {
  timestamps: true,
  collection: 'orders',
  versionKey: false,
});

OrderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    ret.items?.forEach((item: any) => delete item._id);
  }
});

export const Order = model<OrderDocument>('Order', OrderSchema);
