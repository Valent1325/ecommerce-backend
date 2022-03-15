import { Request, Response, NextFunction } from 'express';

import passport from 'passport';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    function(err, user, info) {
      if (err) {
        return next(info);
      }

      if (!user) {
        return res.status(401).json({
          message: 'Необходима авторизация',
        });
      }

      req.user = user;
      return next();
    },
  )(req, res, next);
};
