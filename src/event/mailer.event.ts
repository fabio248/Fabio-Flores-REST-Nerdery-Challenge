import { mailerService, userService } from '../dependencies/dependencies';
import { SendMailConfirmationType } from '../types/mailer';

export const USER_EMAIL_CONFIRMATION = Symbol('USER_EMAIL_CONFIRMATION');

export async function accountEmailConfirmationEvent({
  email,
  id,
}: SendMailConfirmationType): Promise<void> {
  const token = await userService.generateConfimationToken(id);

  await mailerService.sendMail({
    to: email,
    subject: 'Confirmation Account Micro Blog',
    html: `
              <body>
                  <h3>Confirmation account </h3>
                  <p> This is your confirmation token
                  <strong>${token}</strong>
                  </p>
                  <p>This token expire in 15 min</p>
              </body>
            `,
  });
}
