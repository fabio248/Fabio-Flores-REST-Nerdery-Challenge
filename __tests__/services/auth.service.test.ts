import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../src/services/auth.service';
import { PartialMock } from '../utils/generic';
import UserService from '../../src/services/user.service';
import { buildUser, getToken } from '../utils/generate';
import { forbidden } from '@hapi/boom';

describe('AuthService', () => {
  const user = buildUser() as User;
  let userService: PartialMock<UserService> = {
    update: jest.fn(),
  };
  const authService = new AuthService(userService as unknown as UserService);
  const token = getToken;
  const spySign = jest.spyOn(jwt, 'sign').mockImplementation(() => token);

  describe('signToken', () => {
    it('should return new sign token', async () => {
      expect.assertions(2);

      const actual = authService.signToken(user);

      expect(actual).toEqual(token);
      expect(spySign).toHaveBeenCalledTimes(1);
    });
  });

  describe('createAccessToken', () => {
    it('should return accessToken and update user', async () => {
      const user = buildUser({ isVerified: true }) as User;
      expect.assertions(3);

      const spyUserService = jest.spyOn(userService, 'update');

      const actual = await authService.createAccessToken(user);

      expect(actual).toEqual(token);
      expect(spySign).toBeCalledTimes(1);
      expect(spyUserService).toHaveBeenCalledTimes(1);
    });

    it('throw an error when the user is not verified', async () => {
      expect.assertions(3);
      const user = buildUser({ isVerified: false }) as User;
      const expectedError = forbidden('you must verify your account');

      const spyUserService = jest.spyOn(userService, 'update');

      const actual = () => authService.createAccessToken(user);

      expect(actual).rejects.toEqual(expectedError);
      expect(spySign).not.toHaveBeenCalled();
      expect(spyUserService).not.toHaveBeenCalled();
    });
  });
});
