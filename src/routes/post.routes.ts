import { Router } from 'express';
import passport from 'passport';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import {
  createPostSchema,
  createReactioPostSchema,
  getPostSchema,
  updatePostSchema,
} from '../schemas/post.schema';
import {
  commentController,
  postController,
} from '../dependencies/dependencies';
import { createCommentSchema } from '../schemas/comment.schema';

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
  .get(
    validateSchemaHandler(getPostSchema, 'params'),
    postController.findOne.bind(postController),
  )
  .patch(
    [
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getPostSchema, 'params'),
      validateSchemaHandler(updatePostSchema, 'body'),
    ],
    postController.update.bind(postController),
  )
  .delete(
    [
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getPostSchema, 'params'),
    ],
    postController.delete.bind(postController),
  );

postRouter
  .route('/:postId/reactions')
  .post(
    passport.authenticate('jwt', { session: false }),
    validateSchemaHandler(createReactioPostSchema, 'body'),
    postController.createReaction.bind(postController),
  )
  .get(
    validateSchemaHandler(getPostSchema, 'params'),
    postController.findPostWithUserWhoLikedIt.bind(postController),
  );

postRouter
  .route('/:postId/comments')
  .all(passport.authenticate('jwt', { session: false }))
  .post(
    [
      validateSchemaHandler(getPostSchema, 'params'),
      validateSchemaHandler(createCommentSchema, 'body'),
    ],
    commentController.create.bind(commentController),
  );
