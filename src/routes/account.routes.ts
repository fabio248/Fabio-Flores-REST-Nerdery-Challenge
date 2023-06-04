import { Router } from 'express';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import {
  confirmAccountSchema,
  createUserSchema,
  updateUserSchema,
} from '../schemas/user.schema';
import passport from 'passport';
import { userController } from '../dependencies/dependencies';
import { authenticateTokenMiddleware } from '../middleware/verifyJwtToken.middleware';

const accountRouter = Router();

accountRouter.post(
  '/',
  validateSchemaHandler(createUserSchema, 'body'),
  userController.create.bind(userController),
);

accountRouter.post(
  '/confirm-account',
  validateSchemaHandler(confirmAccountSchema, 'params'),
  userController.confirmateAccount.bind(userController),
);

accountRouter
  .route('/me')
  .all(
    authenticateTokenMiddleware,
    passport.authenticate('jwt', { session: false }),
  )
  .get(userController.findOne.bind(userController))
  .patch(
    [validateSchemaHandler(updateUserSchema, 'body')],
    userController.update.bind(userController),
  )
  .delete(userController.delete.bind(userController));

export { accountRouter };
