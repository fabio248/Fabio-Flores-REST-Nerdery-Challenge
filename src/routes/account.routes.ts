import { Router } from 'express';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import {
  confirmAccountSchema,
  createUserSchema,
  updateUserSchema,
} from '../schemas/user.schema';
import {
  confirmateAccount,
  createUser,
  deleteUser,
  findUser,
  updateUser,
} from '../controllers/user.controller';
import passport from 'passport';

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
accountRouter
  .route('/me')
  .all(passport.authenticate('jwt', { session: false }))
  .get(findUser)
  .patch([validateSchemaHandler(updateUserSchema, 'body')], updateUser)
  .delete(deleteUser);

export { accountRouter };
