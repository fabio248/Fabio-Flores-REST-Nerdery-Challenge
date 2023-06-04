import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { AuthService } from '../services/auth.service';

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const response = await this.authService.createAccessToken(user as User);
      res.status(200).json({ accessToken: response });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;

      const accessToken = authorization!.split(' ');

      const response = await this.authService.logout(accessToken[1]);

      res.status(200).json({ message: response });
    } catch (error) {
      next(error);
    }
  }
}
