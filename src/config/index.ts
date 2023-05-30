import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
dotenv.config();

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
