import { Request, Response } from 'express';

import mongoose from 'mongoose';

import { Cart } from '../schemas/Cart';
import { Product } from '../schemas/Product';

import { IUser } from '../models/User';

const { ObjectId } = mongoose.Types;

export const index = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const cart = await Cart.findOne({ user: user.id })
      .populate('items.product');
    
    return res.status(200).json({
      data: cart,
    });
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при получении корзины пользователя',
    });
  }
}

export const store = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Продукт не найден'
      });
    }

    let cart = await Cart.findOne({ user: user.id });

    if (cart) {
      const productExists = cart?.items?.some((item) => new ObjectId(productId).equals(item.product));

      if (productExists) {
        cart = await Cart.findOneAndUpdate(
          { _id: cart.id, 'items.product': productId },
          { $inc: { 'items.$.quantity': quantity || 1 } },
          { new: false },
        );
      } else {
        cart = await Cart.findOneAndUpdate(
          { _id: cart.id },
          { $addToSet: { items: { quantity: quantity || 1, product: productId }} },
          { new: true },
        );
      }

      return res.sendStatus(200);
    } else {
      cart = await Cart.create({
        user: user.id,
        items: [{ quantity: quantity || 1, product: productId }],
      });

      cart = await Cart.findOne({ user: user.id }).populate('items.product');

      return res.status(201).json({
        data: cart,
      });
    }
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при создании корзины пользователя',
    });
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Продукт не найден'
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: user.id, 'items.product': productId },
      { $set: { 'items.$.quantity': quantity } },
      { new: false },
    );

    if (!cart) {
      return res.status(404).json({
        message: 'Корзина пользователя не найдена',
      });
    }

    return res.sendStatus(200);
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при обновлении корзины пользователя',
    });
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Продукт не найден'
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: user.id, 'items.product': productId },
      { $pull: { items: { product: productId } } },
      { new: true },
    );

    if (!cart) {
      return res.status(404).json({
        message: 'Корзина пользователя не найдена',
      });
    }

    return res.sendStatus(204);
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при удалении товара из корзины пользователя',
    });
  }
}

export const clear = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    const cart = await Cart.findOneAndDelete(
      { user: user.id }
    );

    if (!cart) {
      return res.status(404).json({
        message: 'Корзина пользователя не найдена',
      });
    }

    return res.sendStatus(204);
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при очистке корзины пользователя',
    });
  }
}
