import { Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../../config';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { unauthorized } from '@hapi/boom';

const option: StrategyOptions = {
  jwtFromRequest: (req: Request): string | null => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw unauthorized('missing or invalid token');
    }
    const accessToken = authorizationHeader!.split(' ')[1];

    Jwt.verify(accessToken, config.jwtSecret);

    return accessToken;
  },
  secretOrKey: config.jwtSecret as string,
};

const verifyCallback = (
  payload: JwtPayload,
  done: (error: any, user?: false | object) => void,
) => {
  try {
    return done(null, payload);
  } catch (error) {
    return done(error, false);
  }
};

export const JwtStrategy = new Strategy(option, verifyCallback);
