export interface IOrderItem {
  quantity: number;
  product: string;
}

export interface IOrder {
  id: string;
  user: string;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryMethod: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}
