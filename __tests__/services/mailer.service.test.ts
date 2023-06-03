import { MailerService } from '../../src/services/mailer.service';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import { getDescription, getEmail } from '../utils/generate';

const expected = { preview: 'mocked_preview_url' };
const messageMock = { messageId: 'mocked_message_id' };

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve(messageMock)),
  })),
  getTestMessageUrl: jest.fn(() => expected.preview),
}));
jest.mock('../../src/config', () => require('../utils/mockConfig'));

describe('MailerService', () => {
  const mailBody = {
    to: getEmail,
    subject: getDescription,
    html: '<p>hola</p>',
  };
  const mailerService = new MailerService();

  describe('sendMail', () => {
    it('should sent the email', async () => {
      const actual = await mailerService.sendMail(mailBody);

      expect(actual).toEqual(expected);
      expect(createTransport).toHaveBeenCalledTimes(1);
      expect(getTestMessageUrl).toHaveBeenCalledTimes(1);
      expect(getTestMessageUrl).toHaveBeenCalledWith(messageMock);
    });
  });
});
