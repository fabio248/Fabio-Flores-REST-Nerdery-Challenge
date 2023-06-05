import { Report } from '@prisma/client';
import ReportService from '../../src/services/report.service';
import ReportController from '../../src/controllers/report.controller';
import {
  buildNext,
  buildReport,
  buildReq,
  buildRes,
  buildUser,
  getDescription,
  getId,
} from '../utils/generate';
import { PartialMock } from '../utils/generic';
import { Request } from 'express';

describe('ReportController', () => {
  let reportController: ReportController;
  let mockReportService: PartialMock<ReportService>;
  const error = new Error('unexpected error');
  const creationStatus = 201;
  const res = buildRes();
  const next = buildNext();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReportPost', () => {
    const report = buildReport({ postId: getId() }) as Report;

    it('should create a new report to post', async () => {
      expect.assertions(5);
      const req = buildReq({
        user: buildUser({
          sub: report.authorId,
          params: { postId: report.postId },
          body: { reason: report.reason },
        }),
      }) as unknown as Request;
      mockReportService = {
        create: jest.fn().mockResolvedValueOnce(report),
      };
      reportController = new ReportController(
        mockReportService as unknown as ReportService,
      );

      const expected = { message: 'report created', data: report };

      await reportController.createReportPost(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(creationStatus);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(mockReportService.create).toHaveBeenCalledTimes(1);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(4);
      const req = buildReq({
        user: buildUser({
          sub: getId(),
          params: { postId: getId() },
          body: { reason: getDescription },
        }),
      }) as unknown as Request;
      mockReportService = {
        create: jest.fn().mockRejectedValueOnce(error),
      };

      reportController = new ReportController(
        mockReportService as unknown as ReportService,
      );

      await reportController.createReportPost(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('createReportComment', () => {
    const report = buildReport({ commentId: getId() }) as Report;

    it('should create a new report to post', async () => {
      expect.assertions(5);
      const req = buildReq({
        user: buildUser({
          sub: report.authorId,
          params: { postId: report.commentId },
          body: { reason: report.reason },
        }),
      }) as unknown as Request;
      mockReportService = {
        create: jest.fn().mockResolvedValueOnce(report),
      };
      reportController = new ReportController(
        mockReportService as unknown as ReportService,
      );

      const expected = { message: 'report created', data: report };

      await reportController.createReportComment(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(creationStatus);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expected);
      expect(mockReportService.create).toHaveBeenCalledTimes(1);
    });

    it('when happen an error invoke next funtion with the error', async () => {
      expect.assertions(4);
      const req = buildReq({
        user: buildUser({
          sub: getId(),
          params: { commentId: getId() },
          body: { reason: getDescription },
        }),
      }) as unknown as Request;
      mockReportService = {
        create: jest.fn().mockRejectedValueOnce(error),
      };

      reportController = new ReportController(
        mockReportService as unknown as ReportService,
      );

      await reportController.createReportComment(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
