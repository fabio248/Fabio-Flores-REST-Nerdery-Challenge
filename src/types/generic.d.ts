import { Request } from 'express';
import { UserEntry } from './user';

export type PayloadJwt = {
  sub: number;
  role: string;
  iat?: number;
};

type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>;

export type RequestWithUser = Request & { user: UserEntry };

export type messageDelete = {
  message: string;
};
