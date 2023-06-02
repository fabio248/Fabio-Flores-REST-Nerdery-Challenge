import { Post, UsersLikePosts } from '@prisma/client';
import PrismaPostRepository from '../../src/repositories/prisma.post.repository';
import { prismaMock } from '../utils/mockPrisma';
import { PostCreateInput } from '../utils/generic';
import {
  buildPost,
  buildReactionPost,
  getAmountReaction,
  getId,
} from '../utils/generate';
import { CreateUsersLikePosts } from '../../src/types/post';

describe('PrismaPostRepository', () => {
  const id = 1;
  let prismaPostRepository: PrismaPostRepository;
  const post = buildPost({ isDraft: false }) as Post;

  beforeEach(() => {
    prismaPostRepository = new PrismaPostRepository(prismaMock);
  });

  describe('all', () => {
    it('should return all post', async () => {
      expect.assertions(4);
      const expected = [post, post, post] as unknown as Post[];
      prismaMock.post.findMany.mockResolvedValueOnce(expected);

      const actual = await prismaPostRepository.all();

      expect(actual).toHaveLength(3);
      expect(actual[0]).toHaveProperty('title', post.title);
      expect(actual[0]).toHaveProperty('description', post.description);
      expect(actual[0]).toHaveProperty('isDraft', post.isDraft);
    });
  });

  describe('findById', () => {
    it('should return a post', async () => {
      expect.assertions(5);
      prismaMock.post.findUnique.mockResolvedValueOnce({
        ...post,
        id,
      } as unknown as Post);

      const actual = await prismaPostRepository.findById(id);

      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('title', post.title);
      expect(actual).toHaveProperty('description', post.description);
      expect(actual).toHaveProperty('isDraft', post.isDraft);
      expect(prismaMock.post.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new Post', async () => {
      expect.assertions(4);
      prismaMock.post.create.mockResolvedValueOnce(post as unknown as Post);

      const actual = await prismaPostRepository.create(
        post as unknown as PostCreateInput,
      );

      expect(actual).toHaveProperty('title', post.title);
      expect(actual).toHaveProperty('description', post.description);
      expect(actual).toHaveProperty('isDraft', post.isDraft);
      expect(prismaMock.post.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      expect.assertions(5);
      prismaMock.post.update.mockResolvedValueOnce({
        ...post,
        id,
        isDraft: true,
      } as unknown as Post);

      const actual = await prismaPostRepository.update(id, post);

      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('title', post.title);
      expect(actual).toHaveProperty('description', post.description);
      expect(actual).toHaveProperty('isDraft', true);
      expect(prismaMock.post.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      expect.assertions(5);
      prismaMock.post.delete.mockResolvedValueOnce({
        ...post,
        id,
      } as unknown as Post);

      const actual = await prismaPostRepository.delete(id);

      expect(actual).toHaveProperty('id', id);
      expect(actual).toHaveProperty('title', post.title);
      expect(actual).toHaveProperty('description', post.description);
      expect(actual).toHaveProperty('isDraft', post.isDraft);
      expect(prismaMock.post.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('createReaction', () => {
    const createReactionInput = buildReactionPost() as CreateUsersLikePosts;
    const post = buildPost({ id: createReactionInput.postId });

    it('should create a reaction in post', async () => {
      prismaMock.usersLikePosts.create.mockResolvedValueOnce(
        createReactionInput as UsersLikePosts,
      );
      prismaMock.post.findUnique.mockResolvedValueOnce(post as Post);

      const actual = await prismaPostRepository.createReaction(
        createReactionInput,
      );

      expect(actual).toHaveProperty('type', createReactionInput.type);
      expect(actual).toHaveProperty('userId', createReactionInput.userId);
      expect(actual).toHaveProperty('postId', createReactionInput.postId);
      expect(prismaMock.usersLikePosts.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.usersLikePosts.create).toHaveBeenCalledWith({
        data: createReactionInput,
      });
      expect(prismaMock.post.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateAmountReaction', () => {
    it('should update amountLikes when reaction type is like', async () => {
      const createReactionInput = buildReactionPost({
        type: 'LIKE',
      }) as CreateUsersLikePosts;
      const post = buildPost({
        id: createReactionInput.postId,
        amountLike: getAmountReaction,
      }) as Post;

      prismaMock.post.findUnique.mockResolvedValueOnce(post);

      const expectedCalled = {
        where: { id: post.id },
        data: { amountLike: post.amountLike! + 1 },
      };

      await prismaPostRepository.updateAmountReaction(createReactionInput);

      expect(prismaMock.post.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.post.update).toHaveBeenCalledWith(expectedCalled);
      expect(prismaMock.post.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should update amountDislikes when reactions type is dislike', async () => {
      const createReactionInput = buildReactionPost({
        type: 'DISLIKE',
      }) as CreateUsersLikePosts;
      const post = buildPost({
        id: createReactionInput.postId,
        amountDislike: getAmountReaction,
      }) as Post;

      prismaMock.post.findUnique.mockResolvedValueOnce(post);

      const expectedCalled = {
        where: { id: post.id },
        data: { amountDislike: post.amountDislike! + 1 },
      };

      await prismaPostRepository.updateAmountReaction(createReactionInput);

      expect(prismaMock.post.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.post.update).toHaveBeenCalledWith(expectedCalled);
      expect(prismaMock.post.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findReactionByUserIdAndPostId', () => {
    const reaction = buildReactionPost() as CreateUsersLikePosts;
    it('should return a reaction', async () => {
      prismaMock.usersLikePosts.findFirst.mockResolvedValueOnce(
        reaction as UsersLikePosts,
      );

      const actual = await prismaPostRepository.findReactionByUserIdAndPostId(
        reaction.postId,
        reaction.userId,
      );

      expect(actual).toHaveProperty('type', reaction.type);
      expect(actual).toHaveProperty('postId', reaction.postId);
      expect(actual).toHaveProperty('userId', reaction.userId);
      expect(prismaMock.usersLikePosts.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('findPostWithLikesAndUser', () => {
    const post = buildPost({ id: getId() }) as Post;
    it('should return a post with users who liked it', async () => {
      prismaMock.post.findUnique.mockResolvedValueOnce(post);

      const actual = await prismaPostRepository.findPostWithLikesAndUser(
        post.id,
      );

      expect(actual).toEqual(post);
      expect(prismaMock.post.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
