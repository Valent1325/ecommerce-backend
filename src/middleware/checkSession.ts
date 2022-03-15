import { Request, Response, NextFunction } from 'express';

import { nanoid } from 'nanoid';

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.cartId) {
    return next();
  }

  req.session.cartId = nanoid(16);

  return next();
};