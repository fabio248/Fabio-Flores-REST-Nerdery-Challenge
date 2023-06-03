import { Comment, UsersLikeComments } from '@prisma/client';
import { CommentRepository } from '../repositories/repository.interface';
import { badData, forbidden, notFound } from '@hapi/boom';
import { CreateUsersLikeComments } from '../types/post';
import { messageDelete } from '../types/generic';
import PostService from './post.service';

export default class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postService: PostService,
  ) {}

  async create(input: Comment, authorId: number, postId: number) {
    //check if exists the post
    await this.postService.findOne(postId);
    const data = { ...input, authorId, postId };

    const comment = this.commentRepo.create(data);

    return comment;
  }

  async all(): Promise<Comment[]> {
    const COMMENT_IS_DRAFT = true;
    const comments: Comment[] = await this.commentRepo.all();

    const postAreNotDraft = comments.filter(
      (comment) => comment.isDraft !== COMMENT_IS_DRAFT,
    );

    return postAreNotDraft;
  }

  async findOne(commentId: number): Promise<Comment> {
    const comment = await this.commentRepo.findById(commentId);

    if (!comment) {
      throw notFound('comment not found');
    }

    return comment;
  }

  async update(
    commetId: number,
    userId: number,
    input: Partial<Comment>,
  ): Promise<Comment> {
    const comment = await this.findOne(commetId);

    if (comment.authorId !== userId) {
      throw forbidden('it is not your comment');
    }

    const updatedComment = await this.commentRepo.update(commetId, input);

    return updatedComment;
  }

  async delete(commentId: number, userId: number): Promise<messageDelete> {
    const comment = await this.findOne(commentId);

    if (comment.authorId !== userId) {
      throw forbidden('it is not your comment');
    }

    await this.commentRepo.delete(commentId);

    return { message: `deleted comment with id: ${commentId}` };
  }

  async createReaction(
    input: CreateUsersLikeComments,
  ): Promise<UsersLikeComments> {
    await this.findOne(input.commentId);

    const reaction = await this.findReactionByUserAndPost(
      input.commentId,
      input.userId,
    );

    if (reaction) {
      throw badData('You have already liked the comment');
    }

    const newReaction = await this.commentRepo.createReaction(input);

    return newReaction;
  }

  async findReactionByUserAndPost(commentId: number, userId: number) {
    return this.commentRepo.findReactionByUserIdAndCommentId(commentId, userId);
  }

  async findCommentWithLikesAndUser(postId: number): Promise<Comment> {
    await this.findOne(postId);

    const commentWithUserWhoLikedIt =
      await this.commentRepo.findCommentWithLikesAndUser(postId);

    return commentWithUserWhoLikedIt!;
  }
}
