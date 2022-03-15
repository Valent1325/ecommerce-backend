import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { ExtractJwt, Strategy as jwtStrategy } from 'passport-jwt';

import { User } from '../schemas/User';

import { JWT_SECRET } from '../config';

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: 'Пользователь с данным Email адресом не найден',
          });
        }

        const matches = await user.matchesPassword(password);

        if (!matches) {
          return done(null, false, {
            message: 'Неверный пароль',
          });
        }

        return done(null, user, {
          message: 'Успешная аутентификация пользователя',
        });
      } catch(error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'signUp',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email: string, password: string, done) => {
      try {
        const { name } = req.body;

        let user = await User.findOne({ email });

        if (user) {
          return done(null, false, {
            message: 'Пользователь уже существует'
          });
        }

        user = await User.create({
          email,
          password,
          name,
        });

        return done(null, user, {
          message: 'Пользователь успешно добавлен'
        });
      } catch(error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new jwtStrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const { id } = token;
        const user = await User.findById(id);

        if (!user) {
          return done(null, false, {
            message: 'Пользователь не найден',
          });
        }

        return done(null, user);
      } catch(error) {
        return done(error);
      }
    }
  )
);
