import { IProduct } from './Product';

export interface ICartItem {
  quantity: number;
  product: string | IProduct;
}

export interface ICart {
  id: string;
  user: string;
  items: ICartItem[];
}
