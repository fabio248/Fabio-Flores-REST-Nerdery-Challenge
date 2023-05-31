import { Post, User, UsersLikePosts } from '@prisma/client';

export interface BaseRepository<T> {
  all(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(input: object): Promise<T>;
  update(id: number, data: object): Promise<T>;
  delete(id: number): Promise<T>;
}

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
}

export interface PostRepository extends BaseRepository<Post> {
  createReaction(input: object): Promise<UsersLikePosts | null>;
}
