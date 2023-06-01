import { Post } from '@prisma/client';
import PostService from '../../src/services/post.service';
import PrismaPostRepository from '../../src/repositories/prisma.post.repository';
import { PartialMock } from '../utils/generic';
import { badData, forbidden, notFound } from '@hapi/boom';
import {
  buildPost,
  buildReactionPost,
  buildUser,
  getId,
  getUsername,
} from '../utils/generate';
import { CreateUsersLikePosts } from '../../src/types/post';
import { PostRepository } from '../../src/repositories/repository.interface';

describe('PostService', () => {
  let postService: PostService;
  let mockPostRepository: PartialMock<PrismaPostRepository>;
  const authorId = 5;
  let post = buildPost({ authorId, isDraft: false }) as Post;
  let reaction = buildReactionPost() as CreateUsersLikePosts;
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
    it('should create a new reaction to a post', async () => {
      expect.assertions(6);
      const post = buildPost({
        id: reaction.postId,
        authorId: reaction.userId,
      });
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        createReaction: jest.fn().mockReturnValueOnce(reaction),
        findReactionByUserIdAndPostId: jest.fn().mockReturnValueOnce(null),
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

    it('throw an error when the user has already liked the post', async () => {
      const post = buildPost({
        id: reaction.postId,
        authorId: reaction.userId,
      });
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        findReactionByUserIdAndPostId: jest.fn().mockReturnValueOnce(reaction),
        createReaction: jest.fn().mockReturnValueOnce(reaction),
      };

      postService = new PostService(
        mockPostRepository as unknown as PrismaPostRepository,
      );

      const expectedError = badData('You have already liked the post');

      const actual = () => postService.createReaction(reaction);

      expect(actual).rejects.toEqual(expectedError);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.createReaction).not.toHaveBeenCalled();
    });
  });

  describe('findReactionByUserAndPost', () => {
    it('should return a reaction search by user and post', async () => {
      mockPostRepository = {
        findReactionByUserIdAndPostId: jest.fn().mockReturnValueOnce(reaction),
      };

      postService = new PostService(mockPostRepository as PostRepository);

      const actual = await postService.findReactionByUserAndPost(
        reaction.postId,
        reaction.userId,
      );

      expect(actual).toEqual(reaction);
      expect(
        mockPostRepository.findReactionByUserIdAndPostId,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findPostWithLikesAndUser', () => {
    const postWithUserWhoLikedIt = buildPost({
      id: getId({ min: 1, max: 100 }),
      users: {
        1: buildUser({ username: getUsername() }),
        2: buildUser({ username: getUsername() }),
      },
    });
    it('should return a post with user who liked it', async () => {
      mockPostRepository = {
        findById: jest.fn().mockReturnValueOnce(post),
        findPostWithLikesAndUser: jest
          .fn()
          .mockReturnValueOnce(postWithUserWhoLikedIt),
      };

      postService = new PostService(mockPostRepository as PostRepository);

      const actual = await postService.findPostWithLikesAndUser(
        postWithUserWhoLikedIt.id!,
      );

      expect(actual).toEqual(postWithUserWhoLikedIt);
      expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findPostWithLikesAndUser).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
