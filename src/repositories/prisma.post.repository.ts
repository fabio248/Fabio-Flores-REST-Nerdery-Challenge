import { Post, PrismaClient, type Prisma } from '@prisma/client';
import { BaseRepositoryInteface } from './repository.interface';

export default class PrismaPostRepository
  implements BaseRepositoryInteface<Post>
{
  constructor(private readonly prisma: PrismaClient) {}
  all(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }
  findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
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
