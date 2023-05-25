import { NextFunction, Request, Response } from 'express';
import { authService } from '../dependencies/dependencies';
import { User } from '@prisma/client';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    res.status(200).json(await authService.createAccessToken(user as User));
  } catch (error) {
    next(error);
  }
}
