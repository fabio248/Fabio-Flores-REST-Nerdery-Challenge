import Joi from 'joi';

const id = Joi.number();
const firstName = Joi.string().min(3).max(30);
const lastName = Joi.string().min(3).max(30);
const userName = Joi.string();
const role = Joi.string().valid('USER', 'MODERATOR');
const email = Joi.string().email();
const password = Joi.string().min(6).max(20);
const isPublicEmail = Joi.boolean();
const isPublicName = Joi.boolean();
const recoveryToken = Joi.string();
const verifyToken = Joi.string();
const confirmToken = Joi.string();

export const createUserSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  userName: userName.required(),
  email: email.required(),
  password: password.required(),
  role,
  verifyToken,
});
export const updateUserSchema = Joi.object({
  firstName,
  lastName,
  userName,
  role,
  email,
  password,
  isPublicEmail,
  isPublicName,
  recoveryToken,
  verifyToken,
}).min(1);

export const getUserSchema = Joi.object({
  id: id.required(),
});

export const confirmAccountSchema = Joi.object({
  confirmToken,
});
