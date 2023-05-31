import {
  Post,
  PrismaClient,
  UsersLikePosts,
  type Prisma,
} from '@prisma/client';
import { PostRepository } from './repository.interface';
import { CreateUsersLikePosts } from '../types/post';

export default class PrismaPostRepository implements PostRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async updateAmountReaction(input: CreateUsersLikePosts): Promise<void> {
    const post = await this.findById(input.postId);
    if (input.type === 'LIKE') {
      this.prisma.post.update({
        where: { id: input.postId },
        data: { amountLike: post!.amountLike! + 1 },
      });
    }

    if (input.type === 'DISLIKE') {
      this.prisma.post.update({
        where: { id: input.postId },
        data: { amountDislike: post!.amountDislike! + 1 },
      });
    }
  }
  async createReaction(input: CreateUsersLikePosts): Promise<UsersLikePosts> {
    await this.updateAmountReaction(input);

    return this.prisma.usersLikePosts.create({
      data: input as Prisma.UsersLikePostsCreateInput,
    });
  }
  all(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }
  findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            userName: true,
          },
        },
      },
    });
  }
  create(input: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data: input });
  }
  update(id: number, data: object): Promise<Post> {
    return this.prisma.post.update({ where: { id }, data });
  }
  delete(id: number): Promise<Post> {
    return this.prisma.post.delete({ where: { id } });
  }
}
