import { Post, type Prisma } from '@prisma/client';
import { BaseRepositoryInteface } from '../repositories/repository.interface';
import { notFound } from '@hapi/boom';
import { messageDelete } from '../types/generic';

export default class PostService {
  constructor(private readonly postRepo: BaseRepositoryInteface<Post>) {}

  async create(post: Prisma.PostCreateInput, authorId: number): Promise<Post> {
    const newPost = await this.postRepo.create({ ...post, author: authorId });
    return newPost;
  }

  async all(): Promise<Post[]> {
    const post: Post[] = await this.postRepo.all();

    const postArentDraft: Post[] = post.filter((post) => post.isDraft !== true);

    return postArentDraft;
  }

  async findOne(id: number): Promise<Post> {
    const post: Post | null = await this.postRepo.findById(id);

    if (!post) {
      throw notFound('post not found');
    }

    return post!;
  }

  async update(id: number, input: Partial<Post>): Promise<Post> {
    //Check if exist the post
    await this.findOne(id);

    const updatedPost: Post = await this.postRepo.update(id, input);
    return updatedPost;
  }
  async delete(id: number): Promise<messageDelete> {
    await this.findOne(id);

    await this.postRepo.delete(id);

    return { message: `deleted user with id: ${id}` };
  }
}
