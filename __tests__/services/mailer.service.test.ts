import { MailerService } from '../../src/services/mailer.service';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import mockConfig from '../utils/mockConfig';
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
    to: 'examle@gmail.com',
    subject: 'Sample Subject',
    html: '<p>hola</p>',
  };
  const mailerService = new MailerService();
  const transporterBody = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: mockConfig.smtp.email,
      pass: mockConfig.smtp.password,
    },
  };

  describe('sendMail', () => {
    it('should sent the email', async () => {
      const actual = await mailerService.sendMail(mailBody);

      expect(actual).toEqual(expected);
      expect(createTransport).toHaveBeenCalledTimes(1);
      expect(createTransport).toHaveBeenCalledWith(transporterBody);
      expect(getTestMessageUrl).toHaveBeenCalledTimes(1);
      expect(getTestMessageUrl).toHaveBeenCalledWith(messageMock);
    });
  });
});
