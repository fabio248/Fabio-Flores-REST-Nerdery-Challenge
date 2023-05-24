import { NextFunction, Request, Response } from 'express';
import { userService } from '../dependencies/dependencies';

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
}

export async function confirmateAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { confirmToken } = req.query;
    const response = await userService.confirmateAccount(`${confirmToken}`);
    res.status(200).json({ messsage: response.message });
  } catch (error) {
    next(error);
  }
}
