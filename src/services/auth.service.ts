import config from '../config';
import { PayloadJwt } from '../types/generic';
import jwt from 'jsonwebtoken';
import { UserEntry } from '../types/user';
import { userService } from '../dependencies/dependencies';
import { hashSync } from 'bcrypt';

export class AuthService {
  signToken(user: UserEntry): string {
    const payload: PayloadJwt = {
      sub: user.id,
      role: user.role,
    };
    const accessToken: string = jwt.sign(payload, config.jwtSecret);
    return accessToken;
  }

  async createAccessToken(user: UserEntry) {
    const accessToken = this.signToken(user);
    await userService.update(user.id, {
      accessToken: hashSync(accessToken, 10),
    });
    return { accessToken };
  }
}
