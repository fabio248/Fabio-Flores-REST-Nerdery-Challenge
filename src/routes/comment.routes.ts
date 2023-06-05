import { Router } from 'express';
import passport from 'passport';
import { validateSchemaHandler } from '../middleware/validateSchema.middleware';
import {
  createReactioCommentSchema,
  getCommentSchema,
  updateCommentSchema,
} from '../schemas/comment.schema';
import {
  commentController,
  reportController,
} from '../dependencies/dependencies';
import { authenticateTokenMiddleware } from '../middleware/verifyJwtToken.middleware';
import {
  createReportCommentSchema,
  createReportSchema,
} from '../schemas/report.schema';

export const commentRouter = Router();

commentRouter
  .route('/')
  .get(commentController.findMany.bind(commentController));

commentRouter.get(
  ':commentId',
  [validateSchemaHandler(getCommentSchema, 'params')],
  commentController.findOne.bind(commentController),
);

commentRouter
  .route('/:commentId')
  .all(
    authenticateTokenMiddleware,
    passport.authenticate('jwt', { session: false }),
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
  .route('/:commentId/reactions')
  .get(
    [validateSchemaHandler(getCommentSchema, 'params')],
    commentController.findCommentWithUserWhoLikedIt.bind(commentController),
  )
  .post(
    [
      authenticateTokenMiddleware,
      passport.authenticate('jwt', { session: false }),
      validateSchemaHandler(getCommentSchema, 'params'),
      validateSchemaHandler(createReactioCommentSchema, 'body'),
    ],
    commentController.createReaction.bind(commentController),
  );

commentRouter.post(
  '/:commentId/reports',
  [
    authenticateTokenMiddleware,
    passport.authenticate('jwt', { session: false }),
    validateSchemaHandler(createReportCommentSchema, 'params'),
    validateSchemaHandler(createReportSchema, 'body'),
  ],
  reportController.createReportComment.bind(reportController),
);
