import { type Prisma } from '@prisma/client';

export type PostCreateInput = Prisma.PostCreateInput;

type Mock<T> = Record<keyof T, jest.Mock>;
export type PartialMock<T> = Partial<Mock<T>>;
