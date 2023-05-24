import { dbPrisma } from '../db/db.client';
import PrismaUserRepository from '../repositories/prisma.user.repository';
import { AuthService } from '../services/auth.service';
import { MailerService } from '../services/mailer.service';
import UserService from '../services/user.service';

const primasUserRepo = new PrismaUserRepository(dbPrisma);
export const userService = new UserService(primasUserRepo);

export const mailerService = new MailerService();

export const authService = new AuthService();
