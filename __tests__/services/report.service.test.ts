import { ReportRepository } from '../../src/repositories/repository.interface';
import { PartialMock } from '../utils/generic';
import ReportService from '../../src/services/report.service';
import PostService from '../../src/services/post.service';
import CommentService from '../../src/services/comment.service';
import { buildReport, getId } from '../utils/generate';
import { CreateReport } from '../../src/types/report';

describe('ReportService', () => {
  let reportService: ReportService;
  let mockReportRepo: PartialMock<ReportRepository>;
  let mockPostService: PartialMock<PostService> = {
    findOne: jest.fn(),
  };
  let mockCommentService: PartialMock<CommentService> = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create report to post', async () => {
    const expected = buildReport({
      postId: getId(),
      commentId: null,
    }) as CreateReport;
    mockReportRepo = {
      create: jest.fn().mockResolvedValueOnce(expected),
    };

    reportService = new ReportService(
      mockReportRepo as ReportRepository,
      mockPostService as unknown as PostService,
      mockCommentService as unknown as CommentService,
    );

    const actual = await reportService.create(expected);

    expect(actual).toEqual(expected);
    expect(mockPostService.findOne).toHaveBeenCalledTimes(1);
    expect(mockCommentService.findOne).not.toHaveBeenCalled();
  });

  it('create report to comment', async () => {
    const expected = buildReport({
      postId: null,
      commentId: getId(),
    }) as CreateReport;
    mockReportRepo = {
      create: jest.fn().mockResolvedValueOnce(expected),
    };

    reportService = new ReportService(
      mockReportRepo as ReportRepository,
      mockPostService as unknown as PostService,
      mockCommentService as unknown as CommentService,
    );

    const actual = await reportService.create(expected);

    expect(actual).toEqual(expected);
    expect(mockCommentService.findOne).toHaveBeenCalledTimes(1);
    expect(mockPostService.findOne).not.toHaveBeenCalled();
  });
});
