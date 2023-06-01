import { Router } from 'express';
import passport from 'passport';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import {
  createPostSchema,
  createReactioPostSchema,
  getPostSchema,
  updatePostSchema,
} from '../schemas/post.schema';
import { postController } from '../dependencies/dependencies';

export const postRouter = Router();

postRouter
  .route('/')
  .post(
    passport.authenticate('jwt', { session: false }),
    validateSchemaHandler(createPostSchema, 'body'),
    postController.create.bind(postController),
  )
  .get(postController.findMany.bind(postController));

postRouter
  .route('/:postId')
  .all(passport.authenticate('jwt', { session: false }))
  .get(
    validateSchemaHandler(getPostSchema, 'params'),
    postController.findOne.bind(postController),
  )
  .patch(
    [
      validateSchemaHandler(getPostSchema, 'params'),
      validateSchemaHandler(updatePostSchema, 'body'),
    ],
    postController.update.bind(postController),
  )
  .delete(
    [validateSchemaHandler(getPostSchema, 'params')],
    postController.delete.bind(postController),
  );

postRouter
  .route('/:postId/likes')
  .all(passport.authenticate('jwt', { session: false }))
  .post(
    validateSchemaHandler(createReactioPostSchema, 'body'),
    postController.createReaction.bind(postController),
  )
  .get(
    validateSchemaHandler(getPostSchema, 'params'),
    postController.findPostWithUserWhoLikedIt.bind(postController),
  );
