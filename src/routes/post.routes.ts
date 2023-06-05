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
  reportController,
} from '../dependencies/dependencies';
import { createCommentSchema } from '../schemas/comment.schema';
import { authenticateTokenMiddleware } from '../middleware/verifyJwtToken.middleware';
import {
  createReportPostSchema,
  createReportSchema,
} from '../schemas/report.schema';

export const postRouter = Router();

postRouter
  .route('/')
  .post(
    [
      authenticateTokenMiddleware,
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(createPostSchema, 'body'),
    ],
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
      authenticateTokenMiddleware,
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getPostSchema, 'params'),
      validateSchemaHandler(updatePostSchema, 'body'),
    ],
    postController.update.bind(postController),
  )
  .delete(
    [
      authenticateTokenMiddleware,
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getPostSchema, 'params'),
    ],
    postController.delete.bind(postController),
  );

postRouter
  .route('/:postId/reactions')
  .post(
    [
      authenticateTokenMiddleware,
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(createReactioPostSchema, 'body'),
    ],
    postController.createReaction.bind(postController),
  )
  .get(
    validateSchemaHandler(getPostSchema, 'params'),
    postController.findPostWithUserWhoLikedIt.bind(postController),
  );

postRouter
  .route('/:postId/comments')
  .all(
    authenticateTokenMiddleware,
    passport.authenticate('jwt', { session: false }),
  )
  .post(
    [
      validateSchemaHandler(getPostSchema, 'params'),
      validateSchemaHandler(createCommentSchema, 'body'),
    ],
    commentController.create.bind(commentController),
  );

postRouter
  .route('/:postId/reports')
  .all(
    authenticateTokenMiddleware,
    passport.authenticate('jwt', { session: false }),
  )
  .post(
    [
      validateSchemaHandler(createReportPostSchema, 'params'),
      validateSchemaHandler(createReportSchema, 'body'),
    ],
    reportController.createReportPost.bind(reportController),
  );
