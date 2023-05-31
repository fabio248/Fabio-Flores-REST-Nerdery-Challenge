import {
  Post,
  PrismaClient,
  UsersLikePosts,
  type Prisma,
} from '@prisma/client';
import { PostRepository } from './repository.interface';

export default class PrismaPostRepository implements PostRepository {
  constructor(private readonly prisma: PrismaClient) {}
  createReaction(input: object): Promise<UsersLikePosts | null> {
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
