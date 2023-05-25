import { PayloadJwt } from './generic';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: User | PayloadJwt;
    }
  }
}

export {};
