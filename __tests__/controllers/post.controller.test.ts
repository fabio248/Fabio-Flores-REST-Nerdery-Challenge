import { Request } from 'express';
import PostController from '../../src/controllers/post.controller';
import PostService from '../../src/services/post.service';
import {
  buildNext,
  buildPost,
  buildReq,
  buildRes,
  buildUser,
} from '../utils/generate';
import { PartialMock } from '../utils/generic';
import { Post } from '@prisma/client';

describe('PostController', () => {
  let mockPostService: PartialMock<PostService>;
  let postController: PostController;
  const error = new Error('unexpected error');

  beforeEach(async () => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    const user = buildUser({ sub: 1 });
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

      const expectStatus = 201;

      await postController.create(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(expectStatus);
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
    const postId = 1;
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
      const expectStatus = 200;

      await postController.findOne(req, res, next);

      expect(mockPostService.findOne).toHaveBeenCalledWith(postId);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(expectStatus);
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
    const postId = 1;
    const authorId = 1;
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
      const expectStatus = 200;

      await postController.update(req, res, next);

      expect(mockPostService.update).toHaveBeenCalledWith(
        postId,
        post,
        authorId,
      );
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(expectStatus);
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
    const postId = 1;
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
      const expectStatus = 200;

      await postController.delete(req, res, next);

      expect(mockPostService.delete).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(expectStatus);
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
      buildPost({ authorId: 1, isDraft: false }),
      buildPost({ authorId: 2, isDraft: false }),
      buildPost({ authorId: 3, isDraft: false }),
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
      const expectStatus = 200;

      await postController.findMany(req, res, next);

      expect(mockPostService.all).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(expectStatus);
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
});
