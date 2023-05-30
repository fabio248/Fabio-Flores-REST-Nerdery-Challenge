import { Router } from 'express';
import passport from 'passport';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import { createPostSchema } from '../schemas/post.schema';
import { postController } from '../dependencies/dependencies';

export const postRouter = Router();
console.log(postController);
postRouter
  .route('/')
  .all(passport.authenticate('jwt', { session: false }))
  .post(
    validateSchemaHandler(createPostSchema, 'body'),
    postController.createPost,
  );
