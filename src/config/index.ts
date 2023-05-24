import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("  Couldn't find .env file  ");
}

export default {
  enviroment: process.env.NODE_ENV || 'development',
  /**
   * Your favorite port
   */
  port: process.env.PORT,
  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET as Secret,
  /**
   *  Email credentials
   */
  smtp: {
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
  },
};
