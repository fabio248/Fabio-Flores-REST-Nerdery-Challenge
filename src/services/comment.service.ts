import { Comment } from '@prisma/client';
import { CommentRepository } from '../repositories/repository.interface';
import { forbidden, notFound } from '@hapi/boom';

export default class CommentService {
  constructor(private readonly commentRepo: CommentRepository) {}

  async create(input: Comment, authorId: number, postId: number) {
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

  async findOne(commentId: number) {
    const comment = await this.commentRepo.findById(commentId);

    if (!comment) {
      throw notFound('comment not found');
    }

    return comment;
  }

  async update(commetId: number, userId: number, input: Partial<Comment>) {
    const comment = await this.findOne(commetId);

    if (comment.authorId !== userId) {
      throw forbidden('it is not your comment');
    }

    const updatedComment = await this.commentRepo.update(commetId, input);

    return updatedComment;
  }

  async delete(commentId: number, userId: number) {
    const comment = await this.findOne(commentId);

    if (comment.authorId !== userId) {
      throw forbidden('it is not your comment');
    }

    await this.commentRepo.delete(commentId);

    return { message: `deleted comment with id: ${commentId}` };
  }
}
