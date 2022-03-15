import { Request, Response, NextFunction } from 'express';

import passport from 'passport';
import jwt from 'jsonwebtoken';

import { JWT_EPIRES_IN, JWT_SECRET } from '../config';

import { UserDocument } from '../schemas/User';

import { IUser } from '../models/User';

export const sendResponseToken = ({
  user,
  res,
  statusCode,
}: {
  user: IUser | UserDocument;
  res: Response;
  statusCode: number;
}) => {
  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EPIRES_IN,
  });

  user.password = undefined;

  res.status(statusCode).json({ success: true, data: { user, token } });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'login',
    { session: false },
    function (error, user, info) {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(401).json({ message: info.message });
      }

      return sendResponseToken({ user, res, statusCode: 200 });
    }
  )(req, res, next);
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'signUp',
    { session: false },
    function(error, user, info) {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(401).json({ message: info.message });
      }

      return sendResponseToken({ user, res, statusCode: 201 });
    }
  )(req, res, next);
};
