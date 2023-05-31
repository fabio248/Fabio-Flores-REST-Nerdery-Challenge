import { faker } from '@faker-js/faker';
import { Response } from 'express';

// const getUsername = faker.internet.userName;
const getId = faker.number.int;
const getRole = faker.helpers.arrayElement(['USER', 'ADMIN']);

const getTitlePost = faker.string.alpha({ length: { min: 10, max: 50 } });
const getDescriptionPost = faker.commerce.productDescription();

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
    id: getId,
    role: getRole,
    ...overrides,
  };
}

function buildPost({ ...overrides } = {}) {
  return {
    title: getTitlePost,
    description: getDescriptionPost,
    ...overrides,
  };
}

export { buildNext, buildReq, buildRes, buildUser, buildPost };
