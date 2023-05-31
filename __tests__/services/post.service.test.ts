import { Post } from '@prisma/client';
import PostService from '../../src/services/post.service';
import PrismaPostRepository from '../../src/repositories/prisma.post.repository';
import { PartialMock } from '../utils/generic';
import { forbidden, notFound } from '@hapi/boom';
import { buildPost, buildReaction } from '../utils/generate';
import { CreateUsersLikePosts } from '../../src/types/post';

describe('PostService', () => {
  let postService: PostService;
  let mockPostRepository: PartialMock<PrismaPostRepository>;
  const authorId = 5;
  let post = buildPost({ authorId, isDraft: false }) as Post;
  const notFoundError = notFound('post not found');
  const forbiddenError = forbidden('it is not your post');

  beforeEach(async () => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('should return a new post', async () => {
      expect.assertions(4);
      mockPostRepository = { create: jest.fn().mockReturnValueOnce(post) };
      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = await postService.create(post, authorId);

      expect(actual).toHaveProperty('title', post.title);
      expect(actual).toHaveProperty('isDraft', post.isDraft);
      expect(actual).toHaveProperty('description', post.description);
      expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('all', () => {
    it("should return a list of post that aren't draft", async () => {
      expect.assertions(2);
      const postIsDraft = { ...post, isDraft: true };
      mockPostRepository = {
        all: jest.fn().mockReturnValueOnce([post, post, postIsDraft]),
      };
      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = await postService.all();

      expect(actual).toHaveLength(2);
      expect(mockPostRepository.all).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a post that exits search by id', async () => {
      expect.assertions(5);
      const id = 1;
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = await postService.findOne(id);

      expect(actual).toHaveProperty('title', post.title);
      expect(actual).toHaveProperty('isDraft', post.isDraft);
      expect(actual).toHaveProperty('description', post.description);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
    });

    it("throw an error when post doesn't exist ", async () => {
      expect.assertions(3);
      const id = 1;
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(null),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = () => postService.findOne(id);

      expect(actual).rejects.toEqual(notFoundError);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const id = 1;
    const updatePost = {
      ...post,
      title: 'change title',
      id,
    };
    it('should update a post only if owned by the user', async () => {
      expect.assertions(8);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        update: jest.fn().mockReturnValueOnce(updatePost),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = await postService.update(
        id,
        updatePost as Partial<Post>,
        authorId,
      );

      expect(actual).toHaveProperty('title', updatePost.title);
      expect(actual).toHaveProperty('isDraft', updatePost.isDraft);
      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('description', post.description);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
      expect(mockPostRepository.update).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.update).toHaveBeenCalledWith(id, updatePost);
    });

    it('throw an error if the post is not owned by the user', async () => {
      expect.assertions(4);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce({ ...post, authorId: 1 }),
        update: jest.fn().mockReturnValueOnce(updatePost),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = () =>
        postService.update(id, updatePost as Partial<Post>, authorId);

      expect(actual).rejects.toEqual(forbiddenError);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });

    it("throw an error when post doens't exists", async () => {
      expect.assertions(4);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(null),
        update: jest.fn().mockReturnValueOnce(updatePost),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = () =>
        postService.update(id, updatePost as Partial<Post>, authorId);

      expect(actual).rejects.toEqual(notFoundError);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const postId = 1;
    const response = { message: `deleted user with id: ${postId}` };
    it('should delele an exists post and return their id', async () => {
      expect.assertions(5);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        delete: jest.fn().mockReturnValueOnce(post),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );
      const actual = await postService.delete(postId, authorId);

      expect(actual).toEqual(response);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
      expect(mockPostRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.delete).toHaveBeenCalledWith(postId);
    });

    it('throw an error if the post is not owned by the user', async () => {
      // expect.assertions(8);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce({ ...post, authorId: 1 }),
        delete: jest.fn().mockReturnValueOnce(post),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = () => postService.delete(postId, authorId);

      expect(actual).rejects.toEqual(forbiddenError);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });
    it('throw an error when post does not exits', async () => {
      expect.assertions(4);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(null),
        delete: jest.fn().mockReturnValueOnce(post),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = () => postService.delete(postId, authorId);

      expect(actual).rejects.toEqual(notFoundError);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('createReaction', () => {
    const reaction = buildReaction() as CreateUsersLikePosts;
    it('should create a new reaction to a post', async () => {
      expect.assertions(6);
      const post = buildPost({
        id: reaction.postId,
        authorId: reaction.userId,
      });
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        createReaction: jest.fn().mockReturnValueOnce(reaction),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const actual = await postService.createReaction(reaction);

      expect(actual).toHaveProperty('postId', post.id);
      expect(actual).toHaveProperty('userId', post.authorId);
      expect(actual).toHaveProperty('type', reaction.type);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(reaction.postId);
      expect(mockPostRepository.createReaction).toHaveBeenCalledTimes(1);
    });
  });
});
