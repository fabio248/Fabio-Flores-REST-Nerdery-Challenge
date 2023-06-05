import {
  Comment,
  Post,
  Report,
  User,
  UsersLikeComments,
  UsersLikePosts,
} from '@prisma/client';

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
  createReaction(input: object): Promise<UsersLikePosts>;
  updateAmountReaction(input: object): Promise<void>;
  findReactionByUserIdAndPostId(
    postId: number,
    authorId: number,
  ): Promise<UsersLikePosts | null>;
  findPostWithLikesAndUser(postId: number): Promise<Post | null>;
}

export interface CommentRepository extends BaseRepository<Comment> {
  createReaction(input: object): Promise<UsersLikeComments>;
  updateAmountReaction(input: object): Promise<void>;
  findReactionByUserIdAndCommentId(
    commentId: number,
    userId: number,
  ): Promise<UsersLikeComments | null>;
  findCommentWithLikesAndUser(commentId: number): Promise<Comment | null>;
}

export interface ReportRepository {
  create(input: object): Promise<Report>;
}
