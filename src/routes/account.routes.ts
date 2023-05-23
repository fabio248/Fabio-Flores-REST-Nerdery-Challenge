import { Router } from 'express';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import { createUserSchema } from '../schemas/user.schema';
import { createUser } from '../controllers/user.controller';

const accountRouter = Router();

accountRouter.post(
  '/',
  validateSchemaHandler(createUserSchema, 'body'),
  createUser,
);

export { accountRouter };
