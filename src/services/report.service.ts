import { ReportRepository } from '../repositories/repository.interface';
import { CreateReport } from '../types/report';
import CommentService from './comment.service';
import PostService from './post.service';

export default class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  async create(input: CreateReport) {
    if (input.postId) {
      await this.postService.findOne(input.postId);
    }

    if (input.commentId) {
      await this.commentService.findOne(input.commentId);
    }

    const report = await this.reportRepo.create(input);

    return report;
  }
}
