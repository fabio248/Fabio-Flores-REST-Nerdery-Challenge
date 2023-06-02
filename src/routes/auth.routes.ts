import { Router } from 'express';
import passport from 'passport';
import { login } from '../controllers/auth.controller';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import { loginSchema } from '../schemas/auth.schema';

export const authRouter: Router = Router();

authRouter.post(
  '/login',
  validateSchemaHandler(loginSchema, 'body'),
  passport.authenticate('local', { session: false }),
  login,
);
