import { dbPrisma } from '../db/db.client';
import PrismaUserRepository from '../repositories/prisma.user.repository';
import UserService from '../services/user.service';

const primasUserRepo = new PrismaUserRepository(dbPrisma);
export const userService = new UserService(primasUserRepo);
