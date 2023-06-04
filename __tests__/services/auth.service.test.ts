import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../src/services/auth.service';
import { PartialMock } from '../utils/generic';
import UserService from '../../src/services/user.service';
import { buildUser, getToken } from '../utils/generate';
import { forbidden, unauthorized } from '@hapi/boom';

describe('AuthService', () => {
  const user = buildUser() as User;
  let mockUserService: PartialMock<UserService>;
  let authService: AuthService;
  const token = getToken;
  const spySign = jest.spyOn(jwt, 'sign').mockImplementation(() => token);

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('signToken', () => {
    it('should return new sign token', async () => {
      expect.assertions(2);
      authService = new AuthService(mockUserService as unknown as UserService);

      const actual = authService.signToken(user);

      expect(actual).toEqual(token);
      expect(spySign).toHaveBeenCalledTimes(1);
    });
  });

  describe('createAccessToken', () => {
    it('should return accessToken and update user', async () => {
      expect.assertions(3);
      const user = buildUser({ isVerified: true }) as User;
      mockUserService = {
        update: jest.fn(),
      };
      authService = new AuthService(mockUserService as unknown as UserService);

      const actual = await authService.createAccessToken(user);

      expect(actual).toEqual(token);
      expect(spySign).toBeCalledTimes(1);
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
    });

    it('throw an error when the user is not verified', async () => {
      expect.assertions(3);
      mockUserService = {
        update: jest.fn(),
      };
      authService = new AuthService(mockUserService as unknown as UserService);
      const user = buildUser({ isVerified: false }) as User;
      const expectedError = forbidden('you must verify your account');

      const actual = () => authService.createAccessToken(user);

      expect(actual).rejects.toEqual(expectedError);
      expect(spySign).not.toHaveBeenCalled();
      expect(mockUserService.update).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    const accessToken = getToken;
    it('should logout account when accessToke is correct', async () => {
      const expected = 'logout successfully';
      mockUserService = {
        isCorrectAccessToken: jest.fn().mockResolvedValueOnce(true),
        deleteAccessToken: jest.fn().mockResolvedValueOnce(expected),
      };

      authService = new AuthService(mockUserService as unknown as UserService);

      const actual = await authService.logout(accessToken);

      expect(actual).toEqual(expected);
      expect(mockUserService.isCorrectAccessToken).toHaveBeenCalledTimes(1);
      expect(mockUserService.deleteAccessToken).toHaveBeenCalledTimes(1);
    });

    it('throw an error when accessToke is incorrect', async () => {
      const expected = unauthorized('invalid token');
      mockUserService = {
        isCorrectAccessToken: jest.fn().mockResolvedValueOnce(false),
        deleteAccessToken: jest.fn(),
      };

      authService = new AuthService(mockUserService as unknown as UserService);

      const actual = () => authService.logout(accessToken);

      expect(actual).rejects.toEqual(expected);
      expect(mockUserService.isCorrectAccessToken).toHaveBeenCalledTimes(1);
      expect(mockUserService.deleteAccessToken).not.toHaveBeenCalled();
    });
  });
});
