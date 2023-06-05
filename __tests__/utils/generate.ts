import { faker } from '@faker-js/faker';
import { Response } from 'express';
import {
  CreateUsersLikePosts,
  CreateUsersLikeComments,
} from '../../src/types/post';
import { Post } from '@prisma/client';

const getUsername = faker.internet.userName;
const getEmail = faker.internet.email();
const getPassword = faker.internet.password();
const getFirstName = faker.person.firstName();
const getLastName = faker.person.lastName();
const getBoolean = faker.helpers.arrayElement([true, false]);
const getId = faker.number.int;
const getRole = faker.helpers.arrayElement(['USER', 'ADMIN']);
const getTypeReaction = faker.helpers.arrayElement(['LIKE', 'DISLIKE']) as
  | 'LIKE'
  | 'DISLIKE';
const getAmountReaction = faker.number.int({ min: 5, max: 500 });
const getToken = faker.string.uuid();
export const getTitlePost = faker.string.alpha({
  length: { min: 10, max: 50 },
});
const getDescription = faker.commerce.productDescription();
const getIsDraft = faker.helpers.arrayElement([true, false]);

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
    description: getDescription,
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
    body: getDescription,
    ...overrides,
  };
}

function buildReport({ ...overrides } = {}) {
  return {
    reason: getDescription,
    authorId: getId({ min: 1, max: 100 }),
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
  buildReport,
  getUsername,
  getId,
  getRole,
  getTypeReaction,
  getAmountReaction,
  getToken,
  getDescription,
  getIsDraft,
  getEmail,
  getFirstName,
  getLastName,
  getPassword,
  getBoolean,
};
