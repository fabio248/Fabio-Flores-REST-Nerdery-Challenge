import { PrismaClient } from '@prisma/client';

let dbPrisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

dbPrisma = global.__db;

export { dbPrisma };
