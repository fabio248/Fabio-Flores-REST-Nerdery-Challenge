export interface MailBody {
  to: string;
  subject: string;
  html: string;
}

export type SendMailConfirmationType = {
  email: string;
  id: number;
};
