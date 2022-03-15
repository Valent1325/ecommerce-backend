import { Request, Response } from 'express';

import { Cart } from '../schemas/Cart';
import { Order, OrderItem } from '../schemas/Order';

import { IUser } from '../models/User';
import { ICartItem } from '../models/Cart';
import { IProduct } from '../models/Product';
import { OrderStatus } from '../models/Order';

export const index = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    const orders = await Order.find({ user: user.id })
      .populate('items.product')
      .sort('-createdAt');

    return res.status(200).json({
      data: orders,
    });
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при получении списка заказов пользователя',
    });
  }
}

export const store = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { paymentMethod, deliveryMethod } = req.body;

    let cart = (await Cart.findOne({ user: user.id }).populate('items.product'))?.toObject();

    if (!cart) {
      return res.status(404).json({
        message: 'Корзина пользователя не найдена'
      });
    }

    const total = cart?.items?.reduce(
      (acc: number, item: ICartItem) => acc + (item.product as IProduct).price * item.quantity,
      0
    );

    const items: OrderItem[] = cart.items?.map(
      (item: ICartItem) => ({ quantity: item.quantity, product: (item.product as any)['_id'] })
    );

    const newOrder = new Order({
      user: user.id,
      items,
      total,
      status: OrderStatus.CREATED,
      paymentMethod,
      deliveryMethod,
    });
    const { _id } = await newOrder.save();

    await Cart.findOneAndDelete(
      { user: user.id }
    );

    const order = await Order.findById(_id).populate('items.product');

    return res.status(200).json({
      data: order,
    });
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при формировании заказа пользователя',
    });
  }
}
