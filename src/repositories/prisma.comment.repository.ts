import {
  Comment,
  PrismaClient,
  UsersLikeComments,
  type Prisma,
} from '@prisma/client';
import { CommentRepository } from './repository.interface';
import { CreateUsersLikeComments } from '../types/post';

export default class PrismaCommentRepository implements CommentRepository {
  constructor(private readonly prisma: PrismaClient) {}
  findReactionByUserIdAndCommentId(
    commentId: number,
    userId: number,
  ): Promise<UsersLikeComments | null> {
    return this.prisma.usersLikeComments.findFirst({
      where: { commentId, userId },
    });
  }

  all(): Promise<Comment[]> {
    return this.prisma.comment.findMany();
  }
  async createReaction(
    input: CreateUsersLikeComments,
  ): Promise<UsersLikeComments> {
    const reaction = await this.prisma.usersLikeComments.create({
      data: input,
    });

    await this.updateAmountReaction(input);

    return reaction;
  }
  async updateAmountReaction(input: CreateUsersLikeComments): Promise<void> {
    const comment = await this.findById(input.commentId);

    if (input.type === 'LIKE') {
      await this.update(input.commentId, {
        amountLike: comment!.amountLike! + 1,
      });
    }

    if (input.type === 'DISLIKE') {
      await this.update(input.commentId, {
        amountDislike: comment!.amountDislike! + 1,
      });
    }
  }
  findCommentWithLikesAndUser(commentId: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        userLike: {
          select: {
            type: true,
            user: {
              select: {
                id: true,
                userName: true,
              },
            },
          },
        },
      },
    });
  }
  findById(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({ where: { id } });
  }
  create(input: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({ data: input });
  }
  update(id: number, data: object): Promise<Comment> {
    return this.prisma.comment.update({ where: { id }, data });
  }
  delete(id: number): Promise<Comment> {
    return this.prisma.comment.delete({ where: { id } });
  }
}
