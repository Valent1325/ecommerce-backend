import { Request, Response } from 'express';

import { Product, ProductDocument } from '../schemas/Product';

type Filter = {
  name: string;
  values: string[];
}

export const index = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    const filters = products.reduce((result: Filter[], product: ProductDocument) => {
      ['os', 'cpu', 'memory', 'ram', 'color'].forEach((key: string) => {
        const existedFilter = result.find((item: Filter) => item.name === key);
        if (existedFilter) {
          if (!existedFilter.values?.includes(product.properties[key])) {
            existedFilter.values.push(product.properties[key]);
          }
        } else {
          result.push({
            name: key,
            values: [product.properties[key]]
          });
        }
      });
      return result;
    }, [] as Filter[]);

    return res.status(200).json({
      data: filters
    });
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при получении фильтров',
    });
  }
};
