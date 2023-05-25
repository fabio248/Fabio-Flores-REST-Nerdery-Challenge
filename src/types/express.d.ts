import { UserEntry } from './user';

declare global {
  namespace Express {
    export interface Request {
      user?: UserEntry;
    }
  }
}

export {};
