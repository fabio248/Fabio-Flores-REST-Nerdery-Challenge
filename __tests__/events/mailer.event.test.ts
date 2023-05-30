const token = 'samleToken';
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
import { SendMailConfirmationType } from '../../src/types/mailer';
import { accountEmailConfirmationEvent } from '../../src/event/mailer.event';

describe('accountEmailConfirmationEvent', () => {
  const confirmationArgument: SendMailConfirmationType = {
    email: 'fabio@gmail.com',
    id: 123,
  };
  it('should send account confirmation email', async () => {
    await accountEmailConfirmationEvent(confirmationArgument);

    expect(userService.generateConfimationToken).toHaveBeenCalledTimes(1);
    expect(userService.generateConfimationToken).toBeCalledWith(
      confirmationArgument.id,
    );
    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
  });
});
