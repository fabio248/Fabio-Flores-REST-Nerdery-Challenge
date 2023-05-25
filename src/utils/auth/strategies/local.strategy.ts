import { Strategy, VerifyFunction } from 'passport-local';
import { userService } from '../../../dependencies/dependencies';
import { User } from '@prisma/client';

const verifyFunc: VerifyFunction = async (
  email: string,
  password: string,
  done: (error: any, user?: false | Partial<User>) => void,
) => {
  try {
    const user: Partial<User> = await userService.authenticateUser(
      email,
      password,
    );
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const LocalStrategy: Strategy = new Strategy(
  { usernameField: 'email' },
  verifyFunc,
);
