import { Report } from '@prisma/client';
import { buildReport, getId } from '../utils/generate';
import { prismaMock } from './../utils/mockPrisma';
import PrismaReportRepository from '../../src/repositories/prisma.report.repository';
import { CreateReport } from '../../src/types/report';

describe('PrismaReportRepository', () => {
  let prismaReportRepository: PrismaReportRepository;
  const report = buildReport() as unknown as Report;

  it('should create a new report post', async () => {
    const input: CreateReport = {
      reason: report.reason,
      authorId: report.authorId,
      postId: getId(),
    };
    prismaMock.report.create.mockResolvedValueOnce(report);
    prismaReportRepository = new PrismaReportRepository(prismaMock);

    const actual = await prismaReportRepository.create(input);

    expect(actual).toEqual(report);
    expect(prismaMock.report.create).toHaveBeenCalledTimes(1);
  });

  it('should create a new report comment', async () => {
    const input: CreateReport = {
      reason: report.reason,
      authorId: report.authorId,
      commentId: getId(),
    };
    prismaMock.report.create.mockResolvedValueOnce(report);
    prismaReportRepository = new PrismaReportRepository(prismaMock);

    const actual = await prismaReportRepository.create(input);

    expect(actual).toEqual(report);
    expect(prismaMock.report.create).toHaveBeenCalledTimes(1);
  });
});
