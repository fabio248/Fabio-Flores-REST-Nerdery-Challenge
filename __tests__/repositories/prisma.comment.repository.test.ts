import { Comment, UsersLikeComments } from '@prisma/client';
import {
  buildComment,
  buildReactionComment,
  getAmountReaction,
  getId,
  getIsDraft,
} from '../utils/generate';
import { prismaMock } from '../utils/mockPrisma';
import PrismaCommentRepository from '../../src/repositories/prisma.comment.repository';
import { CreateUsersLikeComments } from '../../src/types/post';

describe('PrismaCommentRepository', () => {
  const comment = buildComment({
    id: getId({ min: 1, max: 100 }),
  }) as unknown as Comment;
  let prismaCommentRepository: PrismaCommentRepository;
  beforeEach(async () => {
    prismaCommentRepository = new PrismaCommentRepository(prismaMock);
  });

  describe('all', () => {
    const comments = [
      comment,
      buildComment(),
      buildComment(),
    ] as unknown as Comment[];
    it('should return a list of comments', async () => {
      expect.assertions(4);
      prismaMock.comment.findMany.mockResolvedValueOnce(comments);

      const actual = await prismaCommentRepository.all();

      expect(actual).toHaveLength(3);
      expect(actual[0]).toHaveProperty('id', comment.id);
      expect(actual[0]).toHaveProperty('body', comment.body);
      expect(prismaMock.comment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a especific comment seached by id', async () => {
      expect.assertions(3);
      prismaMock.comment.findUnique.mockResolvedValueOnce(comment);

      const actual = await prismaCommentRepository.findById(comment.id);

      expect(actual).toHaveProperty('id', comment.id);
      expect(actual).toHaveProperty('body', comment.body);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const comment = buildComment({
      authorId: getId({ min: 0, max: 100 }),
      isDraft: getIsDraft,
    }) as Comment;
    it('should create a new Post', async () => {
      expect.assertions(3);
      prismaMock.comment.create.mockResolvedValueOnce(comment as any);

      const actual = await prismaCommentRepository.create(comment as any);

      expect(actual).toHaveProperty('body', comment.body);
      expect(actual).toHaveProperty('isDraft', comment.isDraft);
      expect(prismaMock.comment.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateComment = { ...comment, isDraft: getIsDraft } as Comment;
    it('should update a comment', async () => {
      prismaMock.comment.update.mockResolvedValueOnce(updateComment);

      const actual = await prismaCommentRepository.update(
        updateComment.id,
        updateComment,
      );

      expect(actual).toHaveProperty('body', updateComment.body);
      expect(actual).toHaveProperty('isDraft', updateComment.isDraft);
      expect(actual).toHaveProperty('id', updateComment.id);
      expect(prismaMock.comment.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      prismaMock.comment.delete.mockResolvedValueOnce(comment);

      const actual = await prismaCommentRepository.delete(comment.id);

      expect(actual).toEqual(comment);
      expect(prismaMock.comment.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('findReactionByUserIdAndCommentId', () => {
    const reactionComment = buildReactionComment() as CreateUsersLikeComments;
    it('should return a reaction for a comment searched by user id and comment id', async () => {
      prismaMock.usersLikeComments.findFirst.mockResolvedValueOnce(
        reactionComment as UsersLikeComments,
      );

      const actual =
        await prismaCommentRepository.findReactionByUserIdAndCommentId(
          reactionComment.commentId,
          reactionComment.userId,
        );

      expect(actual).toEqual(reactionComment);
      expect(prismaMock.usersLikeComments.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateAmountReaction', () => {
    it('should update amountLikes when reaction type is like', async () => {
      const reactionLike = buildReactionComment({
        type: 'LIKE',
      }) as CreateUsersLikeComments;
      const comment = buildComment({
        id: reactionLike.commentId,
        amountLike: getAmountReaction,
      }) as Comment;

      prismaMock.comment.findUnique.mockResolvedValueOnce(comment as Comment);

      const expectedCalled = {
        where: { id: comment.id },
        data: { amountLike: comment.amountLike! + 1 },
      };

      await prismaCommentRepository.updateAmountReaction(reactionLike);

      expect(prismaMock.comment.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.comment.update).toHaveBeenCalledWith(expectedCalled);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should update amountDislikes when reactions type is dislike', async () => {
      const reactionDislike = buildReactionComment({
        type: 'DISLIKE',
      }) as CreateUsersLikeComments;
      const comment = buildComment({
        id: reactionDislike.commentId,
        amountDislike: getAmountReaction,
      }) as Comment;

      prismaMock.comment.findUnique.mockResolvedValueOnce(comment as Comment);

      const expectedCalled = {
        where: { id: comment.id },
        data: { amountDislike: comment.amountDislike! + 1 },
      };

      await prismaCommentRepository.updateAmountReaction(reactionDislike);

      expect(prismaMock.comment.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.comment.update).toHaveBeenCalledWith(expectedCalled);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('createReactionComment', () => {
    const comment = buildComment({ id: getId }) as Comment;
    const reaction = buildReactionComment({
      commentId: comment.id,
    }) as UsersLikeComments;
    it('should create a reaction for a comment', async () => {
      prismaMock.comment.findUnique.mockResolvedValueOnce(comment);
      prismaMock.usersLikeComments.create.mockResolvedValueOnce(reaction);

      const actual = await prismaCommentRepository.createReaction(
        reaction as CreateUsersLikeComments,
      );

      expect(actual).toEqual(reaction);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.comment.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.usersLikeComments.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findCommentWithLikesAndUser', () => {
    const comment = buildComment({ id: getId() }) as Comment;
    it('should return a post with users who liked it', async () => {
      prismaMock.comment.findUnique.mockResolvedValueOnce(comment);

      const actual = await prismaCommentRepository.findCommentWithLikesAndUser(
        comment.id,
      );

      expect(actual).toEqual(comment);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
