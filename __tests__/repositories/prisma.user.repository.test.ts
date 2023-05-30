import PrismaUserRepository from '../../src/repositories/prisma.user.repository';
import { prismaMock } from '../utils/mockPrisma';
import { CreateUserEntry } from '../../src/types/user';
import { User } from '@prisma/client';
let prismaUserRepo: PrismaUserRepository;

beforeEach(() => {
  prismaUserRepo = new PrismaUserRepository(prismaMock);
});
describe('PrismaUserRepository', () => {
  const user: CreateUserEntry = {
    email: 'fabio@gmail.com',
    password: 'password',
    firstName: 'Fabio',
    lastName: 'Flores',
    userName: 'fabio',
    isPublicEmail: true,
    isPublicName: true,
  };
  describe('all', () => {
    it('should return a list of users', async () => {
      prismaMock.user.findMany.mockResolvedValue([user, user, user] as User[]);

      const actual = await prismaUserRepo.all();

      expect(actual.length).toBe(3);
    });
  });

  describe('findById', () => {
    it('should return a user found by id', async () => {
      const id: number = 1;
      prismaMock.user.findUnique.mockResolvedValue(user as User);

      const actual = await prismaUserRepo.findById(id);

      expect(actual).toHaveProperty('firstName', user.firstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('userName', user.userName);
      expect(actual).toHaveProperty('email', user.email);
      expect(actual).toHaveProperty('isPublicEmail', user.isPublicEmail);
      expect(actual).toHaveProperty('isPublicName', user.isPublicName);
    });
  });

  describe('findByEmail', () => {
    it('shouled return a user found by email', async () => {
      const email = 'fabio@gmail.com';
      prismaMock.user.findUnique.mockResolvedValue(user as User);

      const actual = await prismaUserRepo.findByEmail(email);

      expect(actual).toHaveProperty('firstName', user.firstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('userName', user.userName);
      expect(actual).toHaveProperty('email', user.email);
      expect(actual).toHaveProperty('isPublicEmail', user.isPublicEmail);
      expect(actual).toHaveProperty('isPublicName', user.isPublicName);
    });
  });

  describe('findByUsername', () => {
    it('should return a user found by username', async () => {
      const username = 'fabio';
      prismaMock.user.findUnique.mockResolvedValue(user as User);

      const actual = await prismaUserRepo.findByUserName(username);

      expect(actual).toHaveProperty('firstName', user.firstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('userName', user.userName);
      expect(actual).toHaveProperty('email', user.email);
      expect(actual).toHaveProperty('isPublicEmail', user.isPublicEmail);
      expect(actual).toHaveProperty('isPublicName', user.isPublicName);
    });
  });
  describe('create', () => {
    it('should create a new user', async () => {
      prismaMock.user.create.mockResolvedValue(user as User);

      const actual = await prismaUserRepo.create(user);

      expect(actual).toHaveProperty('firstName', user.firstName);
      expect(actual).toHaveProperty('lastName', user.lastName);
      expect(actual).toHaveProperty('userName', user.userName);
      expect(actual).toHaveProperty('email', user.email);
      expect(actual).toHaveProperty('isPublicEmail', user.isPublicEmail);
      expect(actual).toHaveProperty('isPublicName', user.isPublicName);
    });
  });

  describe('update', () => {
    it('should update a users name ', async () => {
      prismaMock.user.update.mockResolvedValue({
        ...user,
        firstName: 'Ernesto',
      } as User);

      const actual = await prismaUserRepo.update(1, {
        ...user,
        firstName: 'Ernesto',
      });

      expect(actual).toHaveProperty('firstName', 'Ernesto');
    });
  });

  describe('delete', () => {
    it('should delete a users by id and return', async () => {
      prismaMock.user.delete.mockResolvedValue(user as User);

      const actual = await prismaUserRepo.delete(1);

      expect(actual).toBe(user);
    });
  });
});
