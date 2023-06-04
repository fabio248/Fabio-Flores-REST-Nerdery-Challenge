import { User } from '@prisma/client';
import AuthController from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import {
  buildNext,
  buildReq,
  buildRes,
  buildUser,
  getId,
  getToken,
} from '../utils/generate';
import { PartialMock } from '../utils/generic';
import { Request } from 'express';

describe('AuthController', () => {
  let mockAuthService: PartialMock<AuthService>;
  let authController: AuthController;
  const res = buildRes();
  const next = buildNext();
  const user = buildUser({
    sub: getId,
    isVerify: true,
  }) as User;
  const req = buildReq({ user }) as unknown as Request;
  const successfulStatus = 200;
  const accessToken = getToken;
  const error = new Error('unexpected error');

  describe('login', () => {
    it('should create an access token', async () => {
      mockAuthService = {
        createAccessToken: jest.fn().mockResolvedValueOnce(accessToken),
      };
      authController = new AuthController(
        mockAuthService as unknown as AuthService,
      );
      const expected = { accessToken };

      await authController.login(req, res, next);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
      expect(mockAuthService.createAccessToken).toHaveBeenCalledTimes(1);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockAuthService = {
        createAccessToken: jest.fn().mockRejectedValueOnce(error),
      };

      authController = new AuthController(
        mockAuthService as unknown as AuthService,
      );

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(mockAuthService.createAccessToken).toHaveBeenCalledTimes(1);
    });
  });
});
