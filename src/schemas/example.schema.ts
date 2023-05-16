import Joi from 'joi';

const firstName = Joi.string().min(3).max(30);
const lastName = Joi.string().min(3).max(30);

export const createExampleSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
});
