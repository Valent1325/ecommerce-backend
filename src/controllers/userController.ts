import { Request, Response } from 'express';

import { sendResponseToken } from './authController';

import { User } from '../schemas/User';

import { IUser } from '../models/User';

import { UPLOAD_DIR } from '../config';

export const show = async (req: Request, res: Response) => {
  return res.status(200).json({ data: { user: req.user }});
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { name, email, phone, address } = req.body;

    let foundUser = await User.findById(user.id);

    if (!foundUser) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    foundUser.name = name;
    foundUser.email = email;
    foundUser.phone = phone;
    foundUser.address = address;

    if (req['file']) {
      foundUser.avatar = `${UPLOAD_DIR}/${req['file']['filename']}`;
    }

    await foundUser.save();

    return res.status(200).json({ data: { user: foundUser }});
  } catch(e) {
    return res.status(500).json({
      message: 'Ошибка при обновлении данных пользователя'
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    const { newPassword, confirmNewPassword, oldPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(402).json({
        message: 'Пароли не совпадают'
      });
    }

    const foundUser = await User.findById(user.id).select('+password');

    if (!foundUser) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    const passwordCorrect = await foundUser.matchesPassword(oldPassword);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: 'Текущий пароль некорректный'
      });
    }

    foundUser.password = newPassword;
    await foundUser.save();

    sendResponseToken({ user: foundUser, res, statusCode: 200 });
  } catch(e) {
    res.status(500).json({ message: 'Ошибка при смене пароля' });
  }
};
