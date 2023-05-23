import { NextFunction, Request, Response } from 'express';
import { Boom } from '@hapi/boom';

export function errorValidateHandler(
  error: Boom<unknown>,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { payload } = error.output;
  res
    .status(payload.statusCode)
    .json({ error: payload.error, message: payload.message });
}

export function genericErrorHandler(
  err: TypeError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(500).json({ error: err.name, message: err.message });
}
