import { Router } from 'express';
import passport from 'passport';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import { loginSchema } from '../schemas/auth.schema';
import { authController } from '../dependencies/dependencies';

export const authRouter: Router = Router();

authRouter.post(
  '/login',
  validateSchemaHandler(loginSchema, 'body'),
  passport.authenticate('local', { session: false }),
  authController.login.bind(authController),
);
