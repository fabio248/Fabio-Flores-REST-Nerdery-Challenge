import config from '../config';
import { mailBody } from '../types/mailer';
import { createTransport, getTestMessageUrl } from 'nodemailer';

export class MailerService {
  async sendMail(bodyMail: mailBody): Promise<{ preview: string | false }> {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.smtp.email as string,
        pass: config.smtp.password as string,
      },
    });

    const info = await transporter.sendMail({
      ...bodyMail,
      from: config.smtp.email,
    });

    const url = getTestMessageUrl(info);

    return { preview: url };
  }
}
