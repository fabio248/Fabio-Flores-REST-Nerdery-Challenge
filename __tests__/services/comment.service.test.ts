import CommentService from '../../src/services/comment.service';
import PrismaCommentRepository from '../../src/repositories/prisma.comment.repository';
import { PartialMock } from '../utils/generic';
import { badData, forbidden, notFound } from '@hapi/boom';
import {
  buildComment,
  buildPost,
  buildReactionComment,
  buildUser,
  getDescription,
  getId,
  getIsDraft,
  getUsername,
} from '../utils/generate';
import { Comment, Post } from '@prisma/client';
import { CommentRepository } from '../../src/repositories/repository.interface';
import { CreateUsersLikeComments } from '../../src/types/post';
import PostService from '../../src/services/post.service';

describe('CommentService', () => {
  let commentService: CommentService;
  let mockCommentRepository: PartialMock<PrismaCommentRepository>;
  let mockPostService: PartialMock<PostService>;
  const forbiddenError = forbidden('it is not your comment');
  const notFoundError = notFound('comment not found');
  const authorId = getId({ min: 1, max: 100 });
  const postId = getId({ min: 1, max: 100 });
  const commentId = getId();
  const reaction = buildReactionComment() as CreateUsersLikeComments;
  const post = buildPost() as Post;
  const comment = buildComment({
    id: commentId,
    authorId,
    postId,
    isDraft: false,
  }) as Comment;

  describe('CommentService', () => {
    describe('create', () => {
      afterEach(async () => {
        jest.clearAllMocks();
      });

      it('should create a new comment', async () => {
        expect.assertions(4);
        mockCommentRepository = {
          create: jest.fn().mockResolvedValueOnce(comment),
        };

        mockPostService = {
          findOne: jest.fn().mockResolvedValueOnce(post),
        };
        commentService = new CommentService(
          mockCommentRepository as CommentRepository,
          mockPostService as unknown as PostService,
        );

        const actual = await commentService.create(comment, authorId, postId);

        expect(actual).toHaveProperty('authorId', authorId);
        expect(actual).toHaveProperty('postId', postId);
        expect(actual).toHaveProperty('body', comment.body);
        expect(mockCommentRepository.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('all', () => {
    it('should return a list of comment that are not draft', async () => {
      const commentIsDraft = { ...comment, isDraft: true };
      mockCommentRepository = {
        all: jest
          .fn()
          .mockResolvedValueOnce([
            comment,
            comment,
            commentIsDraft,
          ] as Comment[]),
      };
      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = await commentService.all();

      expect(actual).toHaveLength(2);
      expect(mockCommentRepository.all).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a comment that exits search by id', async () => {
      expect.assertions(4);
      mockCommentRepository = {
        findById: jest.fn().mockResolvedValueOnce(comment),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = await commentService.findOne(commentId);

      expect(actual).toHaveProperty('body', comment.body);
      expect(actual).toHaveProperty('isDraft', comment.isDraft);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(commentId);
    });

    it('throw an error when comment does npostot exist ', async () => {
      expect.assertions(3);
      mockCommentRepository = {
        findById: jest.fn().mockResolvedValueOnce(null),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = () => commentService.findOne(commentId);

      expect(actual).rejects.toEqual(notFoundError);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(commentId);
    });
  });

  describe('update', () => {
    const authorId = getId();
    const comment = buildComment({
      id: getId(),
      isDraft: getIsDraft,
      authorId,
    }) as Comment;
    const updateComment = {
      ...comment,
      body: getDescription,
    };

    it('should update a comment only if owned by the user', async () => {
      expect.assertions(7);
      mockCommentRepository = {
        findById: jest.fn().mockReturnValueOnce(comment),
        update: jest.fn().mockReturnValueOnce(updateComment),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = await commentService.update(
        commentId,
        authorId,
        updateComment as Partial<Comment>,
      );

      expect(actual).toHaveProperty('body', updateComment.body);
      expect(actual).toHaveProperty('isDraft', updateComment.isDraft);
      expect(actual).toHaveProperty('id', updateComment.id);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(commentId);
      expect(mockCommentRepository.update).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.update).toHaveBeenCalledWith(
        commentId,
        updateComment,
      );
    });

    it('throw an error if the comment is not owned by the user', async () => {
      expect.assertions(4);
      mockCommentRepository = {
        findById: jest
          .fn()
          .mockReturnValueOnce({ ...comment, authorId: getId }),
        update: jest.fn().mockReturnValueOnce(updateComment),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = () =>
        commentService.update(
          commentId,
          authorId,
          updateComment as Partial<Comment>,
        );

      expect(actual).rejects.toEqual(forbiddenError);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(commentId);
      expect(mockCommentRepository.update).not.toHaveBeenCalled();
    });

    it("throw an error when comment doens't exists", async () => {
      expect.assertions(4);
      mockCommentRepository = {
        findById: jest.fn().mockReturnValueOnce(null),
        update: jest.fn().mockReturnValueOnce(updateComment),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = () =>
        commentService.update(
          commentId,
          authorId,
          updateComment as Partial<Comment>,
        );

      expect(actual).rejects.toEqual(notFoundError);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(commentId);
      expect(mockCommentRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const response = { message: `deleted comment with id: ${commentId}` };
    const comment = buildComment({ id: commentId, authorId });

    it('should delele an exists post and return their id', async () => {
      expect.assertions(5);
      mockCommentRepository = {
        findById: jest.fn().mockReturnValueOnce(comment),
        delete: jest.fn().mockReturnValueOnce(comment),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );
      const actual = await commentService.delete(commentId, authorId);

      expect(actual).toEqual(response);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(commentId);
      expect(mockCommentRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.delete).toHaveBeenCalledWith(commentId);
    });

    it('throw an error if the comment is not owned by the user', async () => {
      expect.assertions(4);
      mockCommentRepository = {
        findById: jest
          .fn()
          .mockReturnValueOnce({ ...comment, authorId: getId }),
        delete: jest.fn().mockReturnValueOnce(comment),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = () => commentService.delete(postId, authorId);

      expect(actual).rejects.toEqual(forbiddenError);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(postId);
      expect(mockCommentRepository.delete).not.toHaveBeenCalled();
    });
    it('throw an error when post does not exits', async () => {
      expect.assertions(4);
      mockCommentRepository = {
        findById: jest.fn().mockReturnValueOnce(null),
        delete: jest.fn().mockReturnValueOnce(comment),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = () => commentService.delete(postId, authorId);

      expect(actual).rejects.toEqual(notFoundError);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(postId);
      expect(mockCommentRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('createReaction', () => {
    it('should create a new reaction to a comment', async () => {
      expect.assertions(6);
      const comment = buildComment({
        id: reaction.commentId,
        authorId: reaction.userId,
      }) as Comment;
      mockCommentRepository = {
        findById: jest.fn().mockReturnValueOnce(comment),
        createReaction: jest.fn().mockReturnValueOnce(reaction),
        findReactionByUserIdAndCommentId: jest.fn().mockReturnValueOnce(null),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = await commentService.createReaction(reaction);

      expect(actual).toHaveProperty('commentId', comment.id);
      expect(actual).toHaveProperty('userId', comment.authorId);
      expect(actual).toHaveProperty('type', reaction.type);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(
        reaction.commentId,
      );
      expect(mockCommentRepository.createReaction).toHaveBeenCalledTimes(1);
    });

    it('throw an error when the user has already liked the comment', async () => {
      expect.assertions(3);
      const comment = buildReactionComment({
        id: reaction.commentId,
        authorId: reaction.userId,
      });
      mockCommentRepository = {
        findById: jest.fn().mockReturnValueOnce(comment),
        findReactionByUserIdAndCommentId: jest
          .fn()
          .mockReturnValueOnce(reaction),
        createReaction: jest.fn().mockReturnValueOnce(reaction),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const expectedError = badData('You have already liked the comment');

      const actual = () => commentService.createReaction(reaction);

      expect(actual).rejects.toEqual(expectedError);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.createReaction).not.toHaveBeenCalled();
    });
  });

  describe('findCommentWithLikesAndUser', () => {
    const commentWithUserWhoLikedIt = buildComment({
      id: getId({ min: 1, max: 100 }),
      users: {
        1: buildUser({ username: getUsername() }),
        2: buildUser({ username: getUsername() }),
      },
    }) as Comment;

    it('should return a comment with user who liked it', async () => {
      mockCommentRepository = {
        findById: jest.fn().mockReturnValueOnce(comment),
        findCommentWithLikesAndUser: jest
          .fn()
          .mockReturnValueOnce(commentWithUserWhoLikedIt),
      };

      commentService = new CommentService(
        mockCommentRepository as CommentRepository,
        mockPostService as unknown as PostService,
      );

      const actual = await commentService.findCommentWithLikesAndUser(
        commentWithUserWhoLikedIt.id!,
      );

      expect(actual).toEqual(commentWithUserWhoLikedIt);
      expect(mockCommentRepository.findById).toHaveBeenCalledTimes(1);
      expect(
        mockCommentRepository.findCommentWithLikesAndUser,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
