import { faker } from '@faker-js/faker';
import { Response } from 'express';
import {
  CreateUsersLikePosts,
  CreateUsersLikeComments,
} from '../../src/types/post';
import { Post } from '@prisma/client';

const getUsername = faker.internet.userName;
const getId = faker.number.int;
const getRole = faker.helpers.arrayElement(['USER', 'ADMIN']);
const getTypeReaction = faker.helpers.arrayElement(['LIKE', 'DISLIKE']) as
  | 'LIKE'
  | 'DISLIKE';
const getAmountReaction = faker.number.int({ min: 5, max: 500 });

export const getTitlePost = faker.string.alpha({
  length: { min: 10, max: 50 },
});
export const getDescriptionPost = faker.commerce.productDescription();
export const getIsDraft = faker.helpers.arrayElement([true, false]);

function buildReq({ ...overrides } = {}) {
  const req = { user: buildUser(), body: {}, params: {}, ...overrides };
  return req;
}

function buildRes(overrides = {}) {
  const res: Response = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  } as unknown as Response;
  return res;
}

function buildNext() {
  return jest.fn().mockName('next');
}

function buildUser({ ...overrides } = {}) {
  return {
    id: getId({ min: 1, max: 100 }),
    role: getRole,
    ...overrides,
  };
}

function buildPost({ ...overrides } = {}): Partial<Post> {
  return {
    title: getTitlePost,
    description: getDescriptionPost,
    ...overrides,
  };
}

function buildReactionPost({ ...overrides } = {}):
  | CreateUsersLikePosts
  | object {
  return {
    type: getTypeReaction,
    userId: getId({ min: 1, max: 100 }),
    postId: getId({ min: 1, max: 100 }),
    ...overrides,
  };
}

function buildReactionComment({ ...overrides } = {}):
  | CreateUsersLikeComments
  | object {
  return {
    type: getTypeReaction,
    userId: getId({ min: 1, max: 100 }),
    commentId: getId({ min: 1, max: 100 }),
    ...overrides,
  };
}

function buildComment({ ...overrides } = {}) {
  return {
    body: getDescriptionPost,
    ...overrides,
  };
}
export {
  buildNext,
  buildReq,
  buildRes,
  buildUser,
  buildPost,
  buildReactionPost,
  buildComment,
  buildReactionComment,
  getUsername,
  getId,
  getRole,
  getTypeReaction,
  getAmountReaction,
};
