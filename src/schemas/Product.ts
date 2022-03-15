import { Schema, model, Document } from 'mongoose';

import { IProductProperties } from '../models/Product';

export interface ProductDocument extends Document {
  name: string;
  price: number;
  photo: string;
  properties: IProductProperties;
}

const ProductSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    photo: { type: Schema.Types.String, required: false },
    properties: {
      os: { type: Schema.Types.String, required: false },
      cpu: { type: Schema.Types.String, required: false },
      memory: { type: Schema.Types.String, required: false },
      ram: { type: Schema.Types.String, required: false },
      camera: { type: Schema.Types.String, required: false },
      batery: { type: Schema.Types.String, required: false },
      color: { type: Schema.Types.String, required: false }
    }
  }, {
    timestamps: true,
    collection: 'products',
    versionKey: false,
  }
);

ProductSchema.index(
  {
    name: 'text'
  },
  {
    weights: {
      name: 2,
    }
  }
);

ProductSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

export const Product = model<ProductDocument>('Product', ProductSchema);
