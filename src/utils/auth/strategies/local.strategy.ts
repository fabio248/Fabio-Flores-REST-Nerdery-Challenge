import { Strategy, VerifyFunction } from 'passport-local';
import { userService } from '../../../dependencies/dependencies';
import { UserEntry } from '../../../types/user';

const verifyFunc: VerifyFunction = async (
  email: string,
  password: string,
  done: (error: any, user?: false | UserEntry) => void,
) => {
  try {
    const user: UserEntry = await userService.authenticateUser(email, password);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const LocalStrategy: Strategy = new Strategy(
  { usernameField: 'email' },
  verifyFunc,
);
