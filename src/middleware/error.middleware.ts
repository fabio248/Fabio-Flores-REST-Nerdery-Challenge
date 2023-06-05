import { NextFunction, Request, Response } from 'express';
import { Boom } from '@hapi/boom';
import { JsonWebTokenError } from 'jsonwebtoken';

export function errorValidateHandler(
  error: Boom<unknown>,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error.isBoom) {
    const { payload } = error.output;
    res
      .status(payload.statusCode)
      .json({ error: payload.error, message: payload.message });
  } else {
    next(error);
  }
}

export function genericErrorHandler(
  err: TypeError,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof JsonWebTokenError) {
    next(err);
  }
  res.status(500).json({ error: err.name, message: 'Something wrong!' });
}

export function jwtErrorHandler(
  err: JsonWebTokenError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(401).json({
    name: err.name || 'jwt invalid',
    message: err.message || 'something wrong with token',
  });
}
