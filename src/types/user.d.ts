import { User } from '@prisma/client';
import { dbPrisma } from '../db/db.client';
export interface UserEntry {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: dbPrisma.user.Role;
  isPublicEmail: boolean;
  isPublicName: boolean;
  isVerified: boolean;
  password: string;
  recoveryToken: string | null;
  verifyToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>;

export type UserWithOutSensitiveInfo = MakeOptional<
  UserEntry,
  'password' | 'createdAt' | 'updatedAt'
>;

export interface CreateUserEntry {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  role?: dbPrisma.user.Role;
  isPublicEmail?: boolean;
  isPublicName?: boolean;
}
