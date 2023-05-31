import { Post, UsersLikePosts } from '@prisma/client';
import { PostRepository } from '../repositories/repository.interface';
import { forbidden, notFound } from '@hapi/boom';
import { messageDelete } from '../types/generic';
import { CreateUsersLikePosts } from '../types/post';

export default class PostService {
  constructor(private readonly postRepo: PostRepository) {}

  async create(post: Partial<Post>, authorId: number): Promise<Post> {
    const newPost = await this.postRepo.create({ ...post, authorId });

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

  async update(
    id: number,
    input: Partial<Post>,
    userId: number,
  ): Promise<Post> {
    //Check if exist the post
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw forbidden('it is not your post');
    }

    const updatedPost: Post = await this.postRepo.update(id, input);

    return updatedPost;
  }

  async delete(postId: number, userId: number): Promise<messageDelete> {
    const post = await this.findOne(postId);

    if (post.authorId !== userId) {
      throw forbidden('it is not your post');
    }

    await this.postRepo.delete(postId);

    return { message: `deleted user with id: ${postId}` };
  }

  async createReaction(input: CreateUsersLikePosts): Promise<UsersLikePosts> {
    const post = await this.findOne(input.postId);

    if (!post) {
      throw notFound('post not found');
    }

    const reaction = await this.postRepo.createReaction(input);
    return reaction;
  }
}
