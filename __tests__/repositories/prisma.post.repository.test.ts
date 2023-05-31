import { Post } from '@prisma/client';
import PrismaPostRepository from '../../src/repositories/prisma.post.repository';
import { prismaMock } from '../utils/mockPrisma';
import { PostCreateInput } from '../utils/generic';

describe('PrismaPostRepository', () => {
  const id = 1;
  let prismaPostRepository: PrismaPostRepository;
  const post = {
    title: 'Sample title',
    description: 'Sample description for a post',
    isDraft: false,
  };
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
});
