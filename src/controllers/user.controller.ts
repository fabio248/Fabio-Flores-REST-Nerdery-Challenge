import { NextFunction, Request, Response } from 'express';
import { userService } from '../dependencies/dependencies';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const inputData = req.body;
    const user = await userService.create(inputData);
    res.status(201).json({
      message: 'Account created',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
