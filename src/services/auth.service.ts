import config from '../config';
import { PayloadJwt } from '../types/generic';
import jwt from 'jsonwebtoken';
import { hashSync } from 'bcrypt';
import { User } from '@prisma/client';
import UserService from './user.service';

export class AuthService {
  constructor(private readonly userService: UserService) {}
  signToken(user: User): string {
    const payload: PayloadJwt = {
      sub: user.id,
      role: user.role,
    };
    const accessToken: string = jwt.sign(payload, config.jwtSecret);
    return accessToken;
  }

  async createAccessToken(user: User): Promise<string> {
    const accessToken = this.signToken(user);
    await this.userService.update(user.id, {
      accessToken: hashSync(accessToken, 10),
    });
    return accessToken;
  }
}
