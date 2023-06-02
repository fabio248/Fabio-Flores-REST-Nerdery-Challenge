import Joi from 'joi';

const id = Joi.number();
const body = Joi.string();
const isDraft = Joi.boolean();
const amountLike = Joi.number();
const amountDisike = Joi.number();
const type = Joi.string().valid('LIKE', 'DISLIKE');

export const getCommentSchema = Joi.object({
  commentId: id.required(),
});

export const createCommentSchema = Joi.object({
  body: body.required(),
  isDraft,
});

export const updateCommentSchema = Joi.object({
  body,
  isDraft,
  amountDisike,
  amountLike,
}).min(1);

export const createReactioCommentSchema = Joi.object({
  type: type.required(),
});
