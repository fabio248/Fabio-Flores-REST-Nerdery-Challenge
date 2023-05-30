import config from '../config';
import dbPrisma from '../db/db.client';
import PrismaUserRepository from '../repositories/prisma.user.repository';
import { AuthService } from '../services/auth.service';
import { MailerService } from '../services/mailer.service';
import UserService from '../services/user.service';
let prismaUserRepo;
let userService: UserService;
let mailerService: MailerService;
let authService: AuthService;

if (config.enviroment === 'development') {
  prismaUserRepo = new PrismaUserRepository(dbPrisma);
  userService = new UserService(prismaUserRepo);

  mailerService = new MailerService();

  authService = new AuthService(userService);
}
export { userService, mailerService, authService };
