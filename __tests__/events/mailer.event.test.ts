import { getEmail, getId, getToken } from '../utils/generate';
const token = getToken;
import { SendMailConfirmationType } from '../../src/types/mailer';
import { accountEmailConfirmationEvent } from '../../src/event/mailer.event';
import {
  mailerService,
  userService,
} from '../../src/dependencies/dependencies';
jest.mock('../../src/dependencies/dependencies', () => ({
  mailerService: {
    sendMail: jest.fn(),
  },
  userService: {
    generateConfimationToken: jest.fn().mockResolvedValue(token),
  },
}));

describe('accountEmailConfirmationEvent', () => {
  const confirmationArgument: SendMailConfirmationType = {
    email: getEmail,
    id: getId(),
  };

  it('should send account confirmation email', async () => {
    expect.assertions(3);
    await accountEmailConfirmationEvent(confirmationArgument);

    expect(userService.generateConfimationToken).toHaveBeenCalledTimes(1);
    expect(userService.generateConfimationToken).toBeCalledWith(
      confirmationArgument.id,
    );
    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
  });
});
