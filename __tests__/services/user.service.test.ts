import UserService from '../../src/services/user.service';
import PrismaUserRepository from '../../src/repositories/prisma.user.repository';
import { CreateUserEntry } from '../../src/types/user';
import { emitter } from '../../src/event';
import { badData, notFound, unauthorized } from '@hapi/boom';
import { UserRepositoryInterface } from '../../src/repositories/repository.interface';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PartialMock } from '../utils/generic';
emitter.emit = jest.fn();

describe('UserService', () => {
  let user: CreateUserEntry = {
    email: 'fabio@gmail.com',
    password: 'password',
    firstName: 'Fabio',
    lastName: 'Flores',
    userName: 'fabio',
    isPublicEmail: true,
    isPublicName: true,
  };
  let userService: UserService;
  let prismaUserRepoMock: PartialMock<PrismaUserRepository>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const spyEmitter = jest.spyOn(emitter, 'emit');

    it('should return a new user without sensitive information', async () => {
      expect.assertions(8);
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest.fn().mockReturnValueOnce(null),
        create: jest.fn().mockReturnValueOnce(user),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as PrismaUserRepository,
      );

      const actual = await userService.create(user);

      expect(actual).toHaveProperty('firstName', user.firstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('userName', user.userName);
      expect(actual).toHaveProperty('email');
      expect(actual).not.toHaveProperty('password');
      expect(actual).not.toHaveProperty('createdAt');
      expect(actual).not.toHaveProperty('updatedAt');
      expect(spyEmitter).toHaveBeenCalledTimes(1);
    });

    it('should return a new user without names and email', async () => {
      expect.assertions(8);

      const userWithOutEmailAndName = {
        ...user,
        isPublicName: false,
        isPublicEmail: false,
      };

      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest.fn().mockReturnValueOnce(null),
        create: jest.fn().mockReturnValueOnce(userWithOutEmailAndName),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as PrismaUserRepository,
      );

      const actual = await userService.create(user);

      expect(actual).toHaveProperty('userName', user.userName);
      expect(actual).not.toHaveProperty('email', user.email);
      expect(actual).not.toHaveProperty('lastName');
      expect(actual).not.toHaveProperty('firstName');
      expect(actual).not.toHaveProperty('password');
      expect(actual).not.toHaveProperty('createdAt');
      expect(actual).not.toHaveProperty('updatedAt');
      expect(spyEmitter).toHaveBeenCalledTimes(1);
    });

    it('throw an error for email already taken', async () => {
      expect.assertions(2);
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(user),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as PrismaUserRepository,
      );

      const actual = () => userService.create(user);

      expect(actual).rejects.toEqual(badData('email already taken'));
      expect(spyEmitter).not.toHaveBeenCalled();
    });

    it('throw an error for username already taken', async () => {
      expect.assertions(2);
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest.fn().mockReturnValueOnce(user),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as PrismaUserRepository,
      );

      const actual = () => userService.create(user);

      expect(actual).rejects.toEqual(badData('username already taken'));
      expect(spyEmitter).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a found user', async () => {
      expect.assertions(7);
      const id = 1;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce({ ...user, id }),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const actual = await userService.findOne(id);

      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('firstName', user.firstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('email', user.email);
      expect(actual).not.toHaveProperty('password');
      expect(actual).not.toHaveProperty('createdAt');
      expect(actual).not.toHaveProperty('updatedAt');
    });

    it('throw an error user not found', async () => {
      expect.assertions(1);
      const id = 1;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(null),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const actual = () => userService.findOne(id);

      expect(actual).rejects.toEqual(notFound('user not found'));
    });
  });
  describe('update', () => {
    it("should update user's info ", async () => {
      expect.assertions(7);

      const id = 1;
      const newFirstName = 'Ernesto';
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest.fn().mockReturnValueOnce(null),
        update: jest
          .fn()
          .mockReturnValueOnce({ ...user, firstName: newFirstName, id }),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const actual = await userService.update(id, { firstName: newFirstName });

      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('firstName', newFirstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('email', user.email);
      expect(actual).not.toHaveProperty('password');
      expect(actual).not.toHaveProperty('createdAt');
      expect(actual).not.toHaveProperty('updatedAt');
    });
    it("should hash the password if it's pass by argument", async () => {
      expect.assertions(8);
      const id = 1;
      const newPassword = 'password';
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest.fn().mockReturnValueOnce(null),
        update: jest.fn().mockReturnValueOnce({ ...user, id }),
      };

      const spyHashSyncBcrypt = jest.spyOn(bcrypt, 'hashSync');

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const actual = await userService.update(id, { password: newPassword });

      expect(spyHashSyncBcrypt).toHaveBeenCalledTimes(1);
      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('firstName', user.firstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('email', user.email);
      expect(actual).not.toHaveProperty('password');
      expect(actual).not.toHaveProperty('createdAt');
      expect(actual).not.toHaveProperty('updatedAt');
    });

    it('throw an error for email already taken', async () => {
      expect.assertions(1);
      const id = 1;
      const emailAlreadyTaken = 'fabioflores021@gmail.com';
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(user),
        findByUserName: jest.fn().mockReturnValueOnce(null),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const expected = badData('email already taken');

      const actual = () => userService.update(id, { email: emailAlreadyTaken });

      expect(actual).rejects.toEqual(expected);
    });

    it('throw an error for username already taken', async () => {
      expect.assertions(1);
      const id = 1;
      const userNameAlreadyTaken = 'fabio';
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest
          .fn()
          .mockReturnValueOnce({ ...user, userName: userNameAlreadyTaken }),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const expected = badData('username already taken');

      const actual = () =>
        userService.update(id, { userName: userNameAlreadyTaken });

      expect(actual).rejects.toEqual(expected);
    });

    it('throw an error when user not exits', async () => {
      expect.assertions(1);
      const id = 1;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(null),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const expected = notFound('user not found');

      const actual = () => userService.update(id, { firstName: 'Ernesto' });

      expect(actual).rejects.toEqual(expected);
    });
  });

  describe('detele', () => {
    it('should return id of the deleted user', async () => {
      expect.assertions(2);
      const id = 1;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        delete: jest.fn().mockReturnValueOnce(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );
      const expected = { message: `deleted user with id: ${id}` };

      const actual = await userService.detele(id);

      expect(actual).toHaveProperty('message', expected.message);
      expect(actual).toEqual(expected);
    });
    it('throw an error when user not exits', async () => {
      expect.assertions(1);
      const id = 1;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(null),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const expected = notFound('user not found');

      const actual = () => userService.detele(id);

      expect(actual).rejects.toEqual(expected);
    });
  });

  describe('generateConfimationToken', () => {
    it('should return token', async () => {
      expect.assertions(2);
      const token = 'this is my confirmation token';
      const spySignJwt = jest.spyOn(jwt, 'sign');
      spySignJwt.mockImplementation(() => token);

      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        update: jest.fn().mockReturnValueOnce(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const actual = await userService.generateConfimationToken(1);

      expect(actual).toEqual(token);
      expect(spySignJwt).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserWithAllInfo', () => {
    const spyVerifyJwt = jest.spyOn(jwt, 'verify');
    spyVerifyJwt.mockImplementation(() => ({
      sub: 1,
    }));
    const token = 'this is my confirmation token';

    it('should confirmate account', async () => {
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValue({
          ...user,
          verifyToken: token,
          isVerified: false,
        }),
        update: jest.fn().mockReturnValue(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );
      const expected = { message: 'account confirmated' };

      const actual = await userService.confirmateAccount(token);

      expect(actual).toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
    });
    it("throw an error when token aren't the same", async () => {
      const invalidToken = 'Invalid token';
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValue({
          ...user,
          verifyToken: token,
          isVerified: false,
        }),
        update: jest.fn().mockReturnValue(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const expected = unauthorized('invalid token');

      const actual = () => userService.confirmateAccount(invalidToken);

      expect(actual).rejects.toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
    });
    it('throw an error when user already verified', async () => {
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValue({
          ...user,
          verifyToken: token,
          isVerified: true,
        }),
        update: jest.fn().mockReturnValue(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );

      const expected = badData('user already verified');

      const actual = () => userService.confirmateAccount(token);

      expect(actual).rejects.toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
    });
    it('throw an error when user doesnt exits', async () => {
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(null),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );
      const expected = unauthorized('user not found');

      const actual = () => userService.confirmateAccount(token);

      expect(actual).rejects.toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
    });
  });

  describe('authenticateUser', () => {
    const email = user.email;
    const password = user.password;
    const spyCompareSyncBcrypt = jest.spyOn(bcrypt, 'compareSync');
    it("should return user's info when pass by argument correct password and email", async () => {
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(user),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );
      spyCompareSyncBcrypt.mockImplementation(() => true);

      const expected = { ...user, password: undefined };

      const actual = await userService.authenticateUser(email, password);

      expect(actual).toEqual(expected);
      expect(spyCompareSyncBcrypt).toHaveBeenCalledTimes(1);
    });
    it('throw an error when email is incorrect ', async () => {
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(null),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );
      const expected = unauthorized('email or password invalid');

      const actual = () => userService.authenticateUser(email, password);

      expect(actual).rejects.toEqual(expected);
      expect(spyCompareSyncBcrypt).not.toHaveBeenCalled();
    });

    it("throw an error when password aren't the same", async () => {
      const incorrectPassword = '123456';
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(user),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepositoryInterface,
      );
      spyCompareSyncBcrypt.mockImplementation(() => false);
      const expected = unauthorized('email or password invalid');

      const actual = () =>
        userService.authenticateUser(email, incorrectPassword);

      expect(actual).rejects.toEqual(expected);
    });
  });
});
