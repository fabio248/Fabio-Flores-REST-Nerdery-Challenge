import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import dbPrisma from '../../src/db/db.client';

jest.mock('../../src/db/db.client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

export const prismaMock = dbPrisma as unknown as DeepMockProxy<PrismaClient>;
