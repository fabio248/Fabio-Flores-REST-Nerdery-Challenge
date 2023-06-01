import Joi from 'joi';

const id = Joi.number();
const authorId = Joi.number();
const title = Joi.string();
const description = Joi.string();
const isDraft = Joi.boolean().default(false);
const type = Joi.string().valid('LIKE', 'DISLIKE');

export const createPostSchema = Joi.object({
  id,
  title: title.required(),
  description: description.required(),
  isDraft,
  authorId,
});

export const getPostSchema = Joi.object({
  postId: id.required(),
});

export const updatePostSchema = Joi.object({
  title,
  description,
  isDraft,
}).min(1);

export const createReactioPostSchema = Joi.object({
  type: type.required(),
});
