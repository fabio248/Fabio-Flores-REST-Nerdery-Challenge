import { User } from '@prisma/client';

export interface BaseRepositoryInteface<T> {
  all(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(input: object): Promise<T>;
  update(id: number, data: object): Promise<T>;
  delete(id: number): Promise<T>;
}

export interface UserRepositoryInterface extends BaseRepositoryInteface<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
}
