type Mock<T> = Record<keyof T, jest.Mock>;
export type PartialMock<T> = Partial<Mock<T>>;
