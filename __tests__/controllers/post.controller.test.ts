import { Request } from 'express';
import PostController from '../../src/controllers/post.controller';
import PostService from '../../src/services/post.service';
import {
  buildNext,
  buildPost,
  buildReactionPost,
  buildReq,
  buildRes,
  buildUser,
  getId,
  getUsername,
} from '../utils/generate';
import { PartialMock } from '../utils/generic';
import { Post } from '@prisma/client';
import { CreateUsersLikePosts } from '../../src/types/post';

describe('PostController', () => {
  let mockPostService: PartialMock<PostService>;
  let postController: PostController;
  const error = new Error('unexpected error');
  const successfulStatus = 200;
  const creationStatus = 201;

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const user = buildUser({ sub: getId() });
    const post = buildPost();
    const req = buildReq({ user, body: post }) as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    it('should return a new post', async () => {
      expect.assertions(5);

      mockPostService = {
        create: jest.fn().mockResolvedValueOnce(post),
      };

      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      const expected = {
        message: 'post created',
        data: post,
      };

      await postController.create(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(creationStatus);
      expect(next).not.toHaveBeenCalled();
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(4);
      mockPostService = {
        create: jest.fn().mockRejectedValueOnce(error),
      };

      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.create(req as any, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const postId = getId();
    const post = buildPost({ id: postId });
    const req = buildReq({ params: { postId } }) as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    it('should find a post by id', async () => {
      expect.assertions(5);

      mockPostService = {
        findOne: jest.fn().mockResolvedValueOnce(post),
      };

      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      const expected = {
        message: 'post found',
        data: post,
      };

      await postController.findOne(req, res, next);

      expect(mockPostService.findOne).toHaveBeenCalledWith(postId);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockPostService = {
        findOne: jest.fn().mockRejectedValueOnce(error),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.findOne(req, res, next);

      expect(mockPostService.findOne).toHaveBeenCalledWith(postId);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const postId = getId();
    const authorId = getId();
    const post = buildPost({ authorId });
    const req = buildReq({
      user: buildUser({ sub: authorId }),
      body: post,
      params: { postId },
    }) as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    it('should update a post', async () => {
      expect.assertions(5);
      mockPostService = {
        update: jest.fn().mockResolvedValueOnce(post),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );
      const expected = {
        message: 'post updated',
        data: post,
      };

      await postController.update(req, res, next);

      expect(mockPostService.update).toHaveBeenCalledWith(
        postId,
        post,
        authorId,
      );
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockPostService = {
        update: jest.fn().mockRejectedValueOnce(error),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.update(req, res, next);

      expect(mockPostService.update).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const postId = getId();
    const req = buildReq({ params: { postId } }) as unknown as Request;
    const res = buildRes();
    const next = buildNext();
    it('should delete a post', async () => {
      expect.assertions(5);
      mockPostService = {
        delete: jest.fn().mockResolvedValueOnce({
          message: `post updated with id: ${postId}`,
        }),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );
      const expected = {
        message: `post updated with id: ${postId}`,
      };

      await postController.delete(req, res, next);

      expect(mockPostService.delete).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockPostService = {
        delete: jest.fn().mockRejectedValueOnce(error),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.delete(req, res, next);

      expect(mockPostService.delete).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    const req = buildReq() as unknown as Request;
    const res = buildRes();
    const next = buildNext();
    const listPost: Post[] = [
      buildPost({ authorId: getId(), isDraft: false }),
      buildPost({ authorId: getId(), isDraft: false }),
      buildPost({ authorId: getId(), isDraft: false }),
    ] as Post[];

    it('should return list of post ', async () => {
      expect.assertions(5);
      mockPostService = {
        all: jest.fn().mockResolvedValueOnce(listPost),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      const expected = { message: 'posts found', data: listPost };

      await postController.findMany(req, res, next);

      expect(mockPostService.all).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockPostService = {
        all: jest.fn().mockRejectedValueOnce(error),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.findMany(req, res, next);

      expect(mockPostService.all).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('createReaction', () => {
    const post = buildPost({ id: getId() }) as Post;
    const reaction = buildReactionPost({
      postId: post.id,
    }) as CreateUsersLikePosts;
    const res = buildRes();
    const next = buildNext();
    const req = buildReq({
      user: buildUser({ sub: reaction.userId }),
      params: { postId: post.id },
      body: { type: reaction.type },
    }) as unknown as Request;

    it('should create reaction to a post', async () => {
      expect.assertions(6);
      mockPostService = {
        createReaction: jest.fn().mockResolvedValueOnce(reaction),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );
      const expected = { message: 'reaction created', data: reaction };

      await postController.createReaction(req, res, next);

      expect(mockPostService.createReaction).toHaveBeenCalledTimes(1);
      expect(mockPostService.createReaction).toHaveBeenCalledWith(reaction);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(creationStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockPostService = {
        createReaction: jest.fn().mockRejectedValueOnce(error),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.createReaction(req, res, next);

      expect(mockPostService.createReaction).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('findPostWithUserWhoLikedIt', () => {
    const postWithUserWhoLikedIt = buildPost({
      id: getId({ min: 1, max: 100 }),
      users: {
        1: buildUser({ username: getUsername() }),
        2: buildUser({ username: getUsername() }),
      },
    });
    const req = buildReq({
      params: { postId: postWithUserWhoLikedIt.id! },
    }) as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    it('should return a post with the user who liked it', async () => {
      mockPostService = {
        findPostWithLikesAndUser: jest
          .fn()
          .mockResolvedValueOnce(postWithUserWhoLikedIt),
      };

      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.findPostWithUserWhoLikedIt(req, res, next);

      expect(mockPostService.findPostWithLikesAndUser).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(successfulStatus);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(5);
      mockPostService = {
        findPostWithLikesAndUser: jest.fn().mockRejectedValueOnce(error),
      };
      postController = new PostController(
        mockPostService as unknown as PostService,
      );

      await postController.findPostWithUserWhoLikedIt(req, res, next);

      expect(mockPostService.findPostWithLikesAndUser).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
