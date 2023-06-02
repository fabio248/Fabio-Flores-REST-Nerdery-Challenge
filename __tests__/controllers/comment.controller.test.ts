import { CreateUsersLikeComments } from './../../src/types/post.d';
import { PartialMock } from '../utils/generic';
import CommentController from '../../src/controllers/comment.controller';
import CommentService from '../../src/services/comment.service';
import {
  buildComment,
  buildNext,
  buildReactionComment,
  buildReq,
  buildRes,
  buildUser,
  getId,
  getUsername,
} from '../utils/generate';
import { Request } from 'express';
import { Comment } from '@prisma/client';
describe('CommentController', () => {
  let mockCommentService: PartialMock<CommentService>;
  let commentController: CommentController;
  const error = new Error('unexpected error');
  const successfulStatus = 200;
  const creationStatus = 201;
  const user = buildUser({ sub: getId() });
  const postId = getId();
  const commentId = getId();
  const comment = buildComment({ id: commentId });
  const res = buildRes();
  const next = buildNext();

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const req = buildReq({
      user,
      body: comment,
      params: { postId },
    }) as unknown as Request;

    it('should create new comment', async () => {
      mockCommentService = {
        create: jest.fn().mockResolvedValueOnce(comment),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      const expected = {
        message: 'comment created',
        data: comment,
      };

      await commentController.create(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(creationStatus);
      expect(res.status).toHaveBeenCalledTimes(1);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(4);
      mockCommentService = {
        create: jest.fn().mockRejectedValueOnce(error),
      };

      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.create(req as any, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const req = buildReq({ params: { commentId } }) as unknown as Request;

    it('should find a comment by id', async () => {
      expect.assertions(5);
      mockCommentService = {
        findOne: jest.fn().mockResolvedValueOnce(comment),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      const expected = {
        message: 'comment found',
        data: comment,
      };

      await commentController.findOne(req, res, next);

      expect(mockCommentService.findOne).toHaveBeenCalledWith(commentId);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockCommentService = {
        findOne: jest.fn().mockRejectedValueOnce(error),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.findOne(req, res, next);

      expect(mockCommentService.findOne).toHaveBeenCalledWith(commentId);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const authorId = getId();
    const comment = buildComment({ authorId });
    const req = buildReq({
      user: buildUser({ sub: authorId }),
      body: comment,
      params: { commentId },
    }) as unknown as Request;

    it('should update a comment', async () => {
      expect.assertions(5);
      mockCommentService = {
        update: jest.fn().mockResolvedValueOnce(comment),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );
      const expected = {
        message: 'comment updated',
        data: comment,
      };

      await commentController.update(req, res, next);

      expect(mockCommentService.update).toHaveBeenCalledWith(
        commentId,
        authorId,
        comment,
      );
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockCommentService = {
        update: jest.fn().mockRejectedValueOnce(error),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.update(req, res, next);

      expect(mockCommentService.update).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const req = buildReq({ params: { commentId } }) as unknown as Request;

    it('should delete a comment', async () => {
      expect.assertions(5);
      mockCommentService = {
        delete: jest.fn().mockResolvedValueOnce({
          message: `deleted comment with id: ${commentId}`,
        }),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );
      const expected = {
        message: `deleted comment with id: ${commentId}`,
      };

      await commentController.delete(req, res, next);

      expect(mockCommentService.delete).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockCommentService = {
        delete: jest.fn().mockRejectedValueOnce(error),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.delete(req, res, next);

      expect(mockCommentService.delete).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    const req = buildReq() as unknown as Request;
    const listComment: Comment[] = [
      buildComment({ authorId: getId(), isDraft: false }),
      buildComment({ authorId: getId(), isDraft: false }),
      buildComment({ authorId: getId(), isDraft: false }),
    ] as unknown as Comment[];

    it('should return list of post ', async () => {
      expect.assertions(5);
      mockCommentService = {
        all: jest.fn().mockResolvedValueOnce(listComment),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      const expected = { message: 'comments found', data: listComment };

      await commentController.findMany(req, res, next);

      expect(mockCommentService.all).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockCommentService = {
        all: jest.fn().mockRejectedValueOnce(error),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.findMany(req, res, next);

      expect(mockCommentService.all).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('createReaction', () => {
    const comment = buildComment({ id: getId() }) as Comment;
    const reaction = buildReactionComment({
      commentId: comment.id,
    }) as CreateUsersLikeComments;
    const res = buildRes();
    const next = buildNext();
    const req = buildReq({
      user: buildUser({ sub: reaction.userId }),
      params: { commentId: comment.id },
      body: { type: reaction.type },
    }) as unknown as Request;

    it('should create reaction to a comment', async () => {
      expect.assertions(6);
      mockCommentService = {
        createReaction: jest.fn().mockResolvedValueOnce(reaction),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );
      const expected = { message: 'reaction created', data: reaction };

      await commentController.createReaction(req, res, next);

      expect(mockCommentService.createReaction).toHaveBeenCalledTimes(1);
      expect(mockCommentService.createReaction).toHaveBeenCalledWith(reaction);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(creationStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockCommentService = {
        createReaction: jest.fn().mockRejectedValueOnce(error),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.createReaction(req, res, next);

      expect(mockCommentService.createReaction).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('findCommentWithUserWhoLikedIt', () => {
    const commentWithUserWhoLikedIt = buildComment({
      id: getId({ min: 1, max: 100 }),
      users: {
        1: buildUser({ username: getUsername() }),
        2: buildUser({ username: getUsername() }),
      },
    }) as Comment;
    const req = buildReq({
      params: { commentId: commentWithUserWhoLikedIt.id! },
    }) as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    it('should return a comment with the user who liked it', async () => {
      expect.assertions(4);
      mockCommentService = {
        findCommentWithLikesAndUser: jest
          .fn()
          .mockResolvedValueOnce(commentWithUserWhoLikedIt),
      };

      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.findCommentWithUserWhoLikedIt(req, res, next);

      expect(
        mockCommentService.findCommentWithLikesAndUser,
      ).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockCommentService = {
        findCommentWithLikesAndUser: jest.fn().mockRejectedValueOnce(error),
      };
      commentController = new CommentController(
        mockCommentService as unknown as CommentService,
      );

      await commentController.findCommentWithUserWhoLikedIt(req, res, next);

      expect(
        mockCommentService.findCommentWithLikesAndUser,
      ).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
