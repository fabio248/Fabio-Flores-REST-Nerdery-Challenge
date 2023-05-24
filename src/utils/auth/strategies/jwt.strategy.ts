import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from '../../../config';

const option: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret as string,
};

const verifyCallback = (
  payload: object,
  done: (error: any, user?: false | object) => void,
) => {
  return done(null, payload);
};

export const JwtStrategy = new Strategy(option, verifyCallback);
