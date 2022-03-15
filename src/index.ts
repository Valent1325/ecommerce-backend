require('dotenv').config();

import express, { Request, Response } from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import passport from 'passport';

import { connectToMongoDB } from './database/mongoose';
import { redisClient, redisStoreClient } from './database/redis';

import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { filtersRouter } from './routes/filters';
import { productRouter } from './routes/product';
import { cartRouter } from './routes/cart';
import { orderRouter } from './routes/order';

import { PORT, SESSION_SECRET, UPLOAD_DIR } from './config';

import { checkSession } from './middleware/checkSession';

import { Product } from './schemas/Product';

import { ICartItem } from './models/Cart';
import { IProduct } from './models/Product';

import { addToCartValidation, deleteItemFromCartValidation, updateCartValidation, validate } from './validation';

require('./lib/passport');

const RedisStore = connectRedis(session);

const app = express();

const start = async() => {
  await connectToMongoDB();

  redisClient.on('error', (err: any) => console.log('[Redis] Error:', err));
  redisStoreClient.on('error', (err: any) => console.log('[Redis Session] Error:', err));

  redisClient.on('connect', () => console.log('[Redis] Connected'));
  redisStoreClient.on('error', (err: any) => console.log('[Redis Session] Error:', err));

  await redisClient.connect();
  await redisStoreClient.connect();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(
    session({
      store: new RedisStore({ client: redisStoreClient as any }),
      secret: `${SESSION_SECRET}`,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 3600 * 1000 * 3
      }
    })
  );
  app.use(passport.initialize());

  // Инициализация маршрутов

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api/auth', authRouter);
  app.use('/api/account', userRouter);
  app.use('/api/filters', filtersRouter);
  app.use('/api/products', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', orderRouter);

  // Корзина без аутентификации
  app.get('/api/redis/cart', checkSession, async (req: Request, res: Response) => {
    try {
      const cartId = req.session['cartId'];
      
      let cartItems: ICartItem[] = [];

      const cartList: { [key: string]: string } = await redisClient.hGetAll(`cart:${cartId}`);
  
      if (!cartList) {
        return res.status(200).json({
          data: null,
        });
      }
  
      for (const itemKey of Object.keys(cartList)) {
        const product = (await Product.findById(itemKey))?.toJSON();
  
        if (product) {
          cartItems.push({
            quantity: parseInt(cartList[itemKey]),
            product: product as IProduct,
          });
        }
      }
      
      return res.status(200).json({
        data: cartItems?.length ? {
          items: cartItems,
        } : null,
      });
    } catch(e) {
      return res.status(500).json({
        message: 'Ошибка при получении корзины',
      });
    }
  });

  app.post('/api/redis/cart', checkSession, addToCartValidation(), validate, async (req: Request, res: Response) => {
    try {
      const cartId = req.session['cartId'];
      const { productId, quantity } = req.body;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          message: 'Продукт не найден'
        });
      }
  
      let quantityInCart = (await redisClient.hGet(`cart:${cartId}`, productId)) || 0;
      quantityInCart = typeof quantityInCart === 'string' ? parseInt(quantityInCart) : quantityInCart;
  
      await redisClient.hSet(`cart:${cartId}`, productId, quantityInCart + (quantity || 1));
      
      return res.sendStatus(201);
    } catch(e) {
      return res.status(500).json({
        message: 'Ошибка при создании корзины',
      });
    }
  });

  app.put('/api/redis/cart/:productId', checkSession, updateCartValidation(), validate, async (req: Request, res: Response) => {
    try {
      const cartId = req.session['cartId'];
      const { quantity } = req.body;
      const { productId } = req.params;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          message: 'Продукт не найден'
        });
      }
  
      const productInCart = await redisClient.hGet(`cart:${cartId}`, productId);
  
      if (!productInCart) {
        return res.status(404).json({
          message: 'Продукт отсутствует в корзине'
        });
      }
  
      await redisClient.hSet(`cart:${cartId}`, productId, quantity);
      
      return res.sendStatus(200);
    } catch(e) {
      return res.status(500).json({
        message: 'Ошибка при создании корзины',
      });
    }
  });

  app.delete('/api/redis/cart/clear', checkSession, async (req: Request, res: Response) => {
    try {
      const cartId = req.session['cartId'];
  
      const cartList: { [key: string]: string } = await redisClient.hGetAll(`cart:${cartId}`);
  
      if (!cartList) {
        return res.status(200).json({
          data: null,
        });
      }
  
      for (const itemKey of Object.keys(cartList)) {
        await redisClient.hDel(`cart:${cartId}`, itemKey);
      }
  
      return res.sendStatus(204);
    } catch(e) {
      return res.status(500).json({
        message: 'Ошибка при очистке корзины',
      });
    }
  });

  app.delete('/api/redis/cart/:productId', checkSession, deleteItemFromCartValidation(), validate, async (req: Request, res: Response) => {
    try {
      const cartId = req.session['cartId'];
      const { productId } = req.params;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          message: 'Продукт не найден'
        });
      }
  
      const productInCart = await redisClient.hGet(`cart:${cartId}`, productId);
  
      if (!productInCart) {
        return res.status(404).json({
          message: 'Продукт отсутствует в корзине'
        });
      }
  
      await redisClient.hDel(`cart:${cartId}`, productId);
      
      return res.sendStatus(204);
    } catch(e) {
      return res.status(500).json({
        message: 'Ошибка при удалении товара из корзины',
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`[Express] порт: ${PORT}`);
  });
}

start();
