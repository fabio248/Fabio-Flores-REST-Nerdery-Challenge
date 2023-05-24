import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { badRequest } from '@hapi/boom';

export function validateSchemaHandler(
  schema: ObjectSchema,
  property: 'params' | 'body' | 'query',
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[property as keyof typeof req];
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      next(badRequest(`${error.name}: ${error.message}`));
    }

    next();
  };
}
