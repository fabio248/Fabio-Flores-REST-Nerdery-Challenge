import { Router } from 'express';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import { confirmAccountSchema, createUserSchema } from '../schemas/user.schema';
import { confirmateAccount, createUser } from '../controllers/user.controller';

const accountRouter = Router();

accountRouter.post(
  '/',
  validateSchemaHandler(createUserSchema, 'body'),
  createUser,
);
accountRouter.post(
  '/confirm-account',
  validateSchemaHandler(confirmAccountSchema, 'params'),
  confirmateAccount,
);

export { accountRouter };
