/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: [
    './__tests__/utils/mockPrisma.ts',
    './__tests__/utils/mockConfig.ts',
  ],
  roots: [
    './__tests__/repositories',
    './__tests__/services',
    './__tests__/events',
    './__tests__/controllers',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*d.ts',
    '!src/dependencies/dependencies.ts',
    '!src/config/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
