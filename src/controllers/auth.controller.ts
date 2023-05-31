import { NextFunction, Request, Response } from 'express';
import { authService } from '../dependencies/dependencies';
import { User } from '@prisma/client';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const response = await authService.createAccessToken(user as User);
    res.status(200).json({ accessToken: response });
  } catch (error) {
    next(error);
  }
}
