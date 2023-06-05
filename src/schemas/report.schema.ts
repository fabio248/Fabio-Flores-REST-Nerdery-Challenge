import Joi from 'joi';

const reason = Joi.string();
const postId = Joi.number();
const commentId = Joi.number();

export const createReportSchema = Joi.object({
  reason: reason.required(),
});

export const createReportPostSchema = Joi.object({
  postId: postId.required(),
});

export const createReportCommentSchema = Joi.object({
  commentId: commentId.required(),
});
