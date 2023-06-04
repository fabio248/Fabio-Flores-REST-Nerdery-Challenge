import config from '../config';
import { PayloadJwt } from '../types/generic';
import Jwt from 'jsonwebtoken';
import { hashSync } from 'bcrypt';
import { User } from '@prisma/client';
import UserService from './user.service';
import { forbidden, unauthorized } from '@hapi/boom';

export class AuthService {
  constructor(private readonly userService: UserService) {}

  signToken(user: User): string {
    const payload: PayloadJwt = {
      sub: user.id,
      role: user.role,
    };
    const accessToken: string = Jwt.sign(payload, config.jwtSecret, {
      expiresIn: '240min',
    });
    return accessToken;
  }

  async createAccessToken(user: User): Promise<string> {
    const ACCOUNT_IS_NOT_VERIFIED = false;

    if (user.isVerified === ACCOUNT_IS_NOT_VERIFIED) {
      throw forbidden('you must verify your account');
    }

    const accessToken = this.signToken(user);

    await this.userService.update(user.id, {
      accessToken: hashSync(accessToken, 10),
    });

    return accessToken;
  }

  async logout(accessToken: string): Promise<string> {
    const isVerify = await this.userService.isCorrectAccessToken(accessToken);

    if (!isVerify) {
      throw unauthorized('invalid token');
    }

    const res = await this.userService.deleteAccessToken(accessToken);

    return res;
  }
}
