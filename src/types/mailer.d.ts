export interface mailBody {
  to: string;
  subject: string;
  html: string;
}

export type sendMailConfirmationType = {
  email: string;
  id: number;
};
