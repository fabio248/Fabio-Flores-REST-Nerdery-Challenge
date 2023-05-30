import Joi from 'joi';

const id = Joi.number();
const description = Joi.string();
const isDraft = Joi.boolean().default(false);

export const createPostSchema = Joi.object({
  id,
  description: description.required(),
  isDraft,
});
