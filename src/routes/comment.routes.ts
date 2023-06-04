import { Router } from 'express';
import passport from 'passport';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import {
  createReactioCommentSchema,
  getCommentSchema,
  updateCommentSchema,
} from '../schemas/comment.schema';
import { commentController } from '../dependencies/dependencies';

export const commentRouter = Router();

commentRouter
  .route('/')
  .get(commentController.findMany.bind(commentController));

commentRouter
  .route('/:commentId')
  .get(
    [validateSchemaHandler(getCommentSchema, 'params')],
    commentController.findOne.bind(commentController),
  )
  .patch(
    [
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getCommentSchema, 'params'),
      validateSchemaHandler(updateCommentSchema, 'body'),
    ],
    commentController.update.bind(commentController),
  )
  .delete(
    [
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getCommentSchema, 'params'),
    ],
    commentController.delete.bind(commentController),
  );

commentRouter
  .route('/:commentId/reactions')
  .get(
    [validateSchemaHandler(getCommentSchema, 'params')],
    commentController.findCommentWithUserWhoLikedIt.bind(commentController),
  )
  .post(
    [
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getCommentSchema, 'params'),
      validateSchemaHandler(createReactioCommentSchema, 'body'),
    ],
    commentController.createReaction.bind(commentController),
  );
