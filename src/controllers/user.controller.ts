import { NextFunction, Request, Response } from 'express';
import { userService } from '../dependencies/dependencies';
import { PayloadJwt } from '../types/generic';

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

export async function findUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user as PayloadJwt;

    const foundUser = await userService.findOne(user.sub);

    res.status(200).json({ message: 'user found', data: foundUser });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user as PayloadJwt;
    const fieldsToUpdate = req.body;

    const userUpdated = await userService.update(user.sub, fieldsToUpdate);

    res.status(200).json({ message: 'user updated', data: userUpdated });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user as PayloadJwt;

    const reponse = await userService.detele(user.sub);

    res.status(200).json({ message: reponse, data: {} });
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
