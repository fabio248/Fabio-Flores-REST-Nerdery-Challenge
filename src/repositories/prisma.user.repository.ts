import { PrismaClient, User } from '@prisma/client';
import { UserRepository } from './repository.interface';
import { CreateUserEntry, UserEntry } from '../types/user';

export default class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  all(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  findByUserName(userName: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userName } });
  }
  create(input: CreateUserEntry): Promise<User> {
    return this.prisma.user.create({ data: input });
  }
  update(id: number, input: Partial<UserEntry>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: input,
    });
  }
  delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
