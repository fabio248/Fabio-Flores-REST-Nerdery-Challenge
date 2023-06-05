import { PrismaClient } from '@prisma/client';
import { CreateReport } from '../types/report';
import { ReportRepository } from './repository.interface';

export default class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateReport) {
    return this.prisma.report.create({
      data: input,
      select: {
        id: true,
        reason: true,
        authorId: true,
        postId: input.postId ? true : false,
        commentId: input.commentId ? true : false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
