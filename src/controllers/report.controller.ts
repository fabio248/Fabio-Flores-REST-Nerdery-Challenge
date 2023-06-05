import { NextFunction, Request, Response } from 'express';
import ReportService from '../services/report.service';
import { JwtPayload } from 'jsonwebtoken';

export default class ReportController {
  constructor(private readonly reportService: ReportService) {}

  async createReportPost(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      const { postId } = req.params;
      const body = req.body;

      const input = {
        postId: +postId,
        authorId: +user.sub!,
        reason: body.reason,
      };

      const report = await this.reportService.create(input);

      res.status(201).json({ message: 'report created', data: report });
    } catch (error) {
      next(error);
    }
  }

  async createReportComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      const { commentId } = req.params;

      const body = req.body;

      const input = {
        commentId: +commentId,
        authorId: +user.sub!,
        reason: body.reason,
      };

      const report = await this.reportService.create(input);

      res.status(201).json({ message: 'report created', data: report });
    } catch (error) {
      next(error);
    }
  }
}
