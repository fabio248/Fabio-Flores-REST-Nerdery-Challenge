import { Post, type Prisma } from '@prisma/client';
import PostService from '../../src/services/post.service';
import PrismaPostRepository from '../../src/repositories/prisma.post.repository';
import { PartialMock } from '../utils/generic';
import { BaseRepositoryInteface } from '../../src/repositories/repository.interface';
import { notFound } from '@hapi/boom';

describe('PostService', () => {
  let postService: PostService;
  let mockPostRepository: PartialMock<PrismaPostRepository>;
  const authorId = 5;
  let post: Prisma.PostCreateInput = {
    title: 'Sample post',
    description: 'Sample description',
    author: authorId as Prisma.UserCreateNestedOneWithoutPostsInput,
    isDraft: false,
  };
  const errorNotFoundPost = notFound('post not found');

  beforeEach(async () => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('should return a new post', async () => {
      expect.assertions(4);
      mockPostRepository = { create: jest.fn().mockReturnValueOnce(post) };
      postService = new PostService(
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
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
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
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
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
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
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
      );

      const actual = () => postService.findOne(id);

      expect(actual).rejects.toEqual(errorNotFoundPost);
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
    it('should edit info of a post', async () => {
      expect.assertions(8);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        update: jest.fn().mockReturnValueOnce(updatePost),
      };

      postService = new PostService(
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
      );

      const actual = await postService.update(id, updatePost as Partial<Post>);

      expect(actual).toHaveProperty('title', updatePost.title);
      expect(actual).toHaveProperty('isDraft', updatePost.isDraft);
      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('description', post.description);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
      expect(mockPostRepository.update).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.update).toHaveBeenCalledWith(id, updatePost);
    });

    it("throw an error when post doen't exists", async () => {
      expect.assertions(4);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(null),
        update: jest.fn().mockReturnValueOnce(updatePost),
      };

      postService = new PostService(
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
      );

      const actual = () => postService.update(id, updatePost as Partial<Post>);

      expect(actual).rejects.toEqual(errorNotFoundPost);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const id = 1;
    const response = { message: `deleted user with id: ${id}` };
    it('should delele an exists post and return their id', async () => {
      expect.assertions(5);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        delete: jest.fn().mockReturnValueOnce(post),
      };

      postService = new PostService(
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
      );
      const actual = await postService.delete(id);

      expect(actual).toEqual(response);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
      expect(mockPostRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.delete).toHaveBeenCalledWith(id);
    });

    it('throw an error when post does not exits', async () => {
      expect.assertions(4);
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(null),
        delete: jest.fn().mockReturnValueOnce(post),
      };

      postService = new PostService(
        mockPostRepository as unknown as BaseRepositoryInteface<Post>,
      );

      const actual = () => postService.delete(id);

      expect(actual).rejects.toEqual(errorNotFoundPost);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(id);
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });
  });
});
