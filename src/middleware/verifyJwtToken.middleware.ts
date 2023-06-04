import { NextFunction, Request, Response } from 'express';
import { userService } from '../dependencies/dependencies';
import { unauthorized } from '@hapi/boom';

export async function authenticateTokenMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    next();
  }

  const accessToken = authorization!.split(' ');

  const res = await userService.isCorrectAccessToken(accessToken[1]);

  if (!res) {
    next(unauthorized('invalid token'));
  }

  next();
}
