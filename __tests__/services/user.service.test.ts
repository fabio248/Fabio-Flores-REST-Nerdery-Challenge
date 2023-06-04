import UserService from '../../src/services/user.service';
import PrismaUserRepository from '../../src/repositories/prisma.user.repository';
import { CreateUserEntry } from '../../src/types/user';
import { emitter } from '../../src/event';
import { badData, notFound, unauthorized } from '@hapi/boom';
import { UserRepository } from '../../src/repositories/repository.interface';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PartialMock } from '../utils/generic';
import {
  buildUser,
  getEmail,
  getFirstName,
  getId,
  getLastName,
  getPassword,
  getToken,
  getUsername,
} from '../utils/generate';

emitter.emit = jest.fn();

describe('UserService', () => {
  const user = buildUser({
    email: getEmail,
    password: getPassword,
    firstName: getFirstName,
    lastName: getLastName,
    userName: getUsername(),
    isPublicEmail: true,
    isPublicName: true,
  }) as unknown as CreateUserEntry;
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
      const id = getId();
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce({ ...user, id }),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
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
        prismaUserRepoMock as unknown as UserRepository,
      );

      const actual = () => userService.findOne(id);

      expect(actual).rejects.toEqual(notFound('user not found'));
    });
  });
  describe('update', () => {
    it("should update user's info ", async () => {
      expect.assertions(7);

      const id = getId();
      const newFirstName = getFirstName;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest.fn().mockReturnValueOnce(null),
        update: jest
          .fn()
          .mockReturnValueOnce({ ...user, firstName: newFirstName, id }),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
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
      const id = getId();
      const newPassword = getPassword;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest.fn().mockReturnValueOnce(null),
        update: jest.fn().mockReturnValueOnce({ ...user, id }),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );
      const spyHashSyncBcrypt = jest.spyOn(bcrypt, 'hashSync');

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
      expect.assertions(2);
      const id = getId();
      const emailAlreadyTaken = getEmail;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(user),
        findByUserName: jest.fn().mockReturnValueOnce(null),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );
      const expected = badData('email already taken');

      const actual = () => userService.update(id, { email: emailAlreadyTaken });

      expect(actual).rejects.toEqual(expected);
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
    });

    it('throw an error for username already taken', async () => {
      expect.assertions(2);
      const id = getId();
      const userNameAlreadyTaken = getUsername();
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        findByEmail: jest.fn().mockReturnValueOnce(null),
        findByUserName: jest
          .fn()
          .mockReturnValueOnce({ ...user, userName: userNameAlreadyTaken }),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );

      const expected = badData('username already taken');

      const actual = () =>
        userService.update(id, { userName: userNameAlreadyTaken });

      expect(actual).rejects.toEqual(expected);
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
    });

    it('throw an error when user not exits', async () => {
      expect.assertions(2);
      const id = getId();
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(null),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );

      const expected = notFound('user not found');

      const actual = () => userService.update(id, { firstName: 'Ernesto' });

      expect(actual).rejects.toEqual(expected);
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('detele', () => {
    it('should return id of the deleted user', async () => {
      expect.assertions(4);
      const id = getId();
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        delete: jest.fn().mockReturnValueOnce(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );
      const expected = { message: `deleted user with id: ${id}` };

      const actual = await userService.detele(id);

      expect(actual).toHaveProperty('message', expected.message);
      expect(actual).toEqual(expected);
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
      expect(prismaUserRepoMock.delete).toHaveBeenCalledTimes(1);
    });

    it('throw an error when user not exits', async () => {
      expect.assertions(2);
      const id = getId();
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(null),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );

      const expected = notFound('user not found');

      const actual = () => userService.detele(id);

      expect(actual).rejects.toEqual(expected);
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateConfimationToken', () => {
    it('should return token', async () => {
      expect.assertions(2);
      const token = getToken;
      const spySignJwt = jest.spyOn(Jwt, 'sign');
      spySignJwt.mockImplementation(() => token);

      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
        update: jest.fn().mockReturnValueOnce(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );

      const actual = await userService.generateConfimationToken(1);

      expect(actual).toEqual(token);
      expect(spySignJwt).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserWithAllInfo', () => {
    const spyVerifyJwt = jest.spyOn(Jwt, 'verify');
    spyVerifyJwt.mockImplementation(() => ({
      sub: getId(),
    }));
    const token = getToken;

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
        prismaUserRepoMock as unknown as UserRepository,
      );
      const expected = { message: 'account confirmated' };

      const actual = await userService.confirmateAccount(token);

      expect(actual).toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
    });

    it("throw an error when token aren't the same", async () => {
      const invalidToken = token + getToken;
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValue({
          ...user,
          verifyToken: token,
          isVerified: false,
        }),
        update: jest.fn().mockReturnValue(user),
      };

      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
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
        prismaUserRepoMock as unknown as UserRepository,
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
        prismaUserRepoMock as unknown as UserRepository,
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
        prismaUserRepoMock as unknown as UserRepository,
      );
      spyCompareSyncBcrypt.mockImplementation(() => true);

      const expected = { ...user, password: undefined, role: undefined };

      const actual = await userService.authenticateUser(email, password);

      expect(actual).toEqual(expected);
      expect(spyCompareSyncBcrypt).toHaveBeenCalledTimes(1);
    });

    it('throw an error when email is incorrect ', async () => {
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(null),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );
      const expected = unauthorized('email or password invalid');

      const actual = () => userService.authenticateUser(email, password);

      expect(actual).rejects.toEqual(expected);
      expect(spyCompareSyncBcrypt).not.toHaveBeenCalled();
    });

    it("throw an error when password aren't the same", async () => {
      const incorrectPassword = getPassword;
      prismaUserRepoMock = {
        findByEmail: jest.fn().mockReturnValueOnce(user),
      };
      userService = new UserService(
        prismaUserRepoMock as unknown as UserRepository,
      );
      spyCompareSyncBcrypt.mockImplementation(() => false);
      const expected = unauthorized('email or password invalid');

      const actual = () =>
        userService.authenticateUser(email, incorrectPassword);

      expect(actual).rejects.toEqual(expected);
    });
  });

  describe('isCorrectAccessToken', () => {
    const spyBcrypt = jest.spyOn(bcrypt, 'compare');
    const accessToken = getToken;
    const spyVerifyJwt = jest.spyOn(Jwt, 'verify');
    const userId = getId();
    const payload = { sub: userId } as unknown as Jwt.JwtPayload;

    it('should return true when access token is correct', async () => {
      const expected = true;
      const user = buildUser({ id: userId, accessToken });
      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
      };

      userService = new UserService(prismaUserRepoMock as UserRepository);
      spyVerifyJwt.mockImplementation(() => payload);
      spyBcrypt.mockImplementation(() => expected);

      const actual = await userService.isCorrectAccessToken(accessToken);

      expect(actual).toEqual(expected);
      expect(spyBcrypt).toHaveBeenCalledTimes(1);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
    });

    it('should return false when user does not have access token store in database', async () => {
      const expected = false;
      const user = buildUser({ id: userId, accessToken: null });

      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
      };

      userService = new UserService(prismaUserRepoMock as UserRepository);
      spyVerifyJwt.mockImplementation(() => payload);

      const actual = await userService.isCorrectAccessToken(accessToken);

      expect(actual).toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
      expect(spyBcrypt).not.toHaveBeenCalled();
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
    });

    it('should return false when access token is incorrect', async () => {
      const expected = false;
      const user = buildUser({ id: userId, accessToken });

      prismaUserRepoMock = {
        findById: jest.fn().mockReturnValueOnce(user),
      };

      userService = new UserService(prismaUserRepoMock as UserRepository);
      spyVerifyJwt.mockImplementation(() => payload);
      spyBcrypt.mockImplementation(() => expected);

      const actual = await userService.isCorrectAccessToken(accessToken);

      expect(actual).toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
      expect(spyBcrypt).toHaveBeenCalledTimes(1);
      expect(prismaUserRepoMock.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAccessToken', () => {
    const accessToken = getToken;
    const spyVerifyJwt = jest.spyOn(Jwt, 'verify');
    const userId = getId();
    const payload = { sub: userId } as unknown as Jwt.JwtPayload;

    it('should delete access token from database', async () => {
      prismaUserRepoMock = {
        update: jest.fn(),
      };
      userService = new UserService(prismaUserRepoMock as UserRepository);
      spyVerifyJwt.mockImplementation(() => payload);
      const expected = 'logout successfully';

      const actual = await userService.deleteAccessToken(accessToken);

      expect(actual).toEqual(expected);
      expect(spyVerifyJwt).toHaveBeenCalledTimes(1);
      expect(prismaUserRepoMock.update).toHaveBeenCalledTimes(1);
    });
  });
});
