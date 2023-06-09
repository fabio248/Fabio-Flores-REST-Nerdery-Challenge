import { User } from '@prisma/client';
import { dbPrisma } from '../db/db.client';

export {};

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
  accessToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithOutSensitiveInfo = Partial<User>;

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
