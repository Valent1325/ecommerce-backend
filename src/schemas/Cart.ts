import { Schema, Document, model } from 'mongoose';

import { ProductDocument } from './Product';
import { UserDocument } from './User';

interface CartItem {
  quantity: number;
  product: ProductDocument['_id'];
}

export interface CartDocument extends Document {
  user: UserDocument['_id'];
  items: CartItem[];
}

const CartItemSchema = new Schema({
  quantity: { type: Schema.Types.Number, default: 1 },
  product: { type: Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false });

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [CartItemSchema],
}, {
  timestamps: true,
  collection: 'carts',
  versionKey: false,
});

CartSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    ret.items?.forEach((item: any) => delete item._id);
  }
});

CartSchema.set('toObject', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    ret.items?.forEach((item: any) => {
      item.id = item._id;
      delete item._id
    });
  }
});

export const Cart = model<CartDocument>('Cart', CartSchema);
