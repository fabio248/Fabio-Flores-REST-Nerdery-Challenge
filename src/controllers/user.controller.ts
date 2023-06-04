import { NextFunction, Request, Response } from 'express';
import { PayloadJwt } from '../types/generic';
import UserService from '../services/user.service';

export default class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const inputData = req.body;

      const user = await this.userService.create(inputData);

      res.status(201).json({
        message: 'Account created',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as PayloadJwt;

      const foundUser = await this.userService.findOne(user.sub);

      res.status(200).json({ message: 'user found', data: foundUser });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as PayloadJwt;
      const fieldsToUpdate = req.body;

      const userUpdated = await this.userService.update(
        user.sub,
        fieldsToUpdate,
      );

      res.status(200).json({ message: 'user updated', data: userUpdated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as PayloadJwt;

      const reponse = await this.userService.detele(user.sub);

      res.status(200).json({ message: reponse.message });
    } catch (error) {
      next(error);
    }
  }

  async confirmateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { confirmToken } = req.query;
      const response = await this.userService.confirmateAccount(
        `${confirmToken}`,
      );
      res.status(200).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  }
}
