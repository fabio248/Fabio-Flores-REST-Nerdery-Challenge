import { PartialMock } from '../utils/generic';
import UserService from '../../src/services/user.service';
import {
  buildNext,
  buildReq,
  buildRes,
  buildUser,
  getEmail,
  getFirstName,
  getId,
  getLastName,
  getPassword,
  getToken,
} from '../utils/generate';
import { User } from '@prisma/client';
import UserController from '../../src/controllers/user.controller';
import { Request } from 'express';

describe('UserController', () => {
  let mockUserService: PartialMock<UserService>;
  let userController: UserController;
  const res = buildRes();
  const next = buildNext();
  const user = buildUser({
    firstName: getFirstName,
    lastName: getLastName,
    email: getEmail,
    password: getPassword,
  }) as User;
  const successfulStatus = 200;
  const creationStatus = 201;
  const error = new Error('unexpected error');

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const req = buildReq({ body: user }) as unknown as Request;

    it('should create a new user', async () => {
      mockUserService = {
        create: jest.fn().mockResolvedValueOnce(user),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );
      const expected = {
        message: 'Account created',
        data: user,
      };

      await userController.create(req, res, next);

      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(creationStatus);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockUserService = {
        create: jest.fn().mockRejectedValueOnce(error),
      };

      userController = new UserController(
        mockUserService as unknown as UserService,
      );

      await userController.create(req, res, next);

      expect(mockUserService.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const userId = getId();
    const req = buildReq({ user: { sub: userId } }) as unknown as Request;

    it('should find a user by id', async () => {
      expect.assertions(5);
      mockUserService = {
        findOne: jest.fn().mockResolvedValueOnce(user),
      };

      userController = new UserController(
        mockUserService as unknown as UserService,
      );

      const expected = {
        message: 'user found',
        data: user,
      };

      await userController.findOne(req, res, next);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockUserService = {
        findOne: jest.fn().mockRejectedValueOnce(error),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );

      await userController.findOne(req, res, next);

      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const userId = getId();
    const userUpdate = { ...user, firstName: getFirstName, id: userId };
    const req = buildReq({
      user: buildUser({ sub: userId }),
      body: userUpdate,
    }) as unknown as Request;

    it('should update a post', async () => {
      expect.assertions(5);
      mockUserService = {
        update: jest.fn().mockResolvedValueOnce(userUpdate),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );
      const expected = {
        message: 'user updated',
        data: userUpdate,
      };

      await userController.update(req, res, next);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, userUpdate);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockUserService = {
        update: jest.fn().mockRejectedValueOnce(error),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );

      await userController.update(req, res, next);

      expect(mockUserService.update).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const userId = getId();
    const req = buildReq({ params: { postId: userId } }) as unknown as Request;
    const message = `deleted user with id: ${userId}`;
    it('should delete a post', async () => {
      expect.assertions(5);
      mockUserService = {
        detele: jest.fn().mockResolvedValueOnce({ message }),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );
      const expected = { message };

      await userController.delete(req, res, next);

      expect(mockUserService.detele).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockUserService = {
        detele: jest.fn().mockRejectedValueOnce(error),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );

      await userController.delete(req, res, next);

      expect(mockUserService.detele).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('confirmateAccount', () => {
    const expected = { message: 'account confirmated' };
    const confirmToken = getToken;
    const req = buildReq({ query: confirmToken }) as unknown as Request;

    it('should confirmate a new account', async () => {
      mockUserService = {
        confirmateAccount: jest.fn().mockResolvedValueOnce(expected),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );

      await userController.confirmateAccount(req, res, next);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
      expect(mockUserService.confirmateAccount).toHaveBeenCalledTimes(1);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockUserService = {
        confirmateAccount: jest.fn().mockRejectedValueOnce(error),
      };
      userController = new UserController(
        mockUserService as unknown as UserService,
      );

      await userController.confirmateAccount(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(mockUserService.confirmateAccount).toHaveBeenCalledTimes(1);
    });
  });
});
