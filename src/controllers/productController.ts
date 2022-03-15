import { Request, Response } from 'express';

import { Product } from '../schemas/Product';

import ModelQuery from '../utils/ModelQuery';

export const index = async (req: Request, res: Response) => {
  try {
    const models = new ModelQuery(Product.find(), Product, req.query)
      .filter()
      .sort()
      .paginate();

    const products = await models.query;

    const total = await models.count().total;

    return res.status(200).json({ data: { total, products }});
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при получении информации по всем продуктам'
    });
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Продукт не найден'
      });
    }

    return res.status(200).json({ data: { product }});
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при получении информации по продукту'
    });
  }
};