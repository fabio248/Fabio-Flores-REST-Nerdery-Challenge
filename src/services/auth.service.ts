import config from '../config';
import { PayloadJwt } from '../types/generic';
import jwt from 'jsonwebtoken';
import { userService } from '../dependencies/dependencies';
import { hashSync } from 'bcrypt';
import { User } from '@prisma/client';

export class AuthService {
  signToken(user: User): string {
    const payload: PayloadJwt = {
      sub: user.id,
      role: user.role,
    };
    const accessToken: string = jwt.sign(payload, config.jwtSecret);
    return accessToken;
  }

  async createAccessToken(user: User) {
    const accessToken = this.signToken(user);
    await userService.update(user.id, {
      accessToken: hashSync(accessToken, 10),
    });
    return { accessToken };
  }
}
