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
  .route('/:commentId')
  .all(passport.authenticate('jwt', { session: false }))
  .get(
    [validateSchemaHandler(getCommentSchema, 'params')],
    commentController.findOne.bind(commentController),
  )
  .patch(
    [
      validateSchemaHandler(getCommentSchema, 'params'),
      validateSchemaHandler(updateCommentSchema, 'body'),
    ],
    commentController.update.bind(commentController),
  )
  .delete(
    [validateSchemaHandler(getCommentSchema, 'params')],
    commentController.delete.bind(commentController),
  );

commentRouter
  .route('/:commentId/reaction')
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