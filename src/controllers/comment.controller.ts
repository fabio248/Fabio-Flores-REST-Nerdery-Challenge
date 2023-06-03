import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import CommentService from '../services/comment.service';
import { Comment } from '@prisma/client';

export default class CommentController {
  constructor(private readonly commentService: CommentService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const input = req.body;
      const user = req.user as JwtPayload;

      const newComment = await this.commentService.create(
        input,
        +user.sub!,
        +postId,
      );

      res.status(201).json({ message: 'comment created', data: newComment });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const comment = await this.commentService.findOne(+commentId);

      res.status(200).json({ message: 'comment found', data: comment });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      const { commentId } = req.params;
      const input = req.body;

      const updatedComment = await this.commentService.update(
        +commentId,
        +user.sub!,
        input,
      );
      res
        .status(200)
        .json({ message: 'comment updated', data: updatedComment });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const user = req.user as JwtPayload;

      const response = await this.commentService.delete(+commentId, +user.sub!);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const user = req.user as JwtPayload;
      const body = req.body;

      const reaction = await this.commentService.createReaction({
        commentId: +commentId,
        userId: +user.sub!,
        type: body.type,
      });

      res.status(201).json({ message: 'reaction created', data: reaction });
    } catch (error) {
      next(error);
    }
  }

  async findMany(_req: Request, res: Response, next: NextFunction) {
    try {
      const listComment: Comment[] = await this.commentService.all();

      res.status(200).json({ message: 'comments found', data: listComment });
    } catch (error) {
      next(error);
    }
  }

  async findCommentWithUserWhoLikedIt(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { commentId } = req.params;

      const comment = await this.commentService.findCommentWithLikesAndUser(
        +commentId,
      );

      res.status(200).json({ message: 'comment found', data: comment });
    } catch (error) {
      next(error);
    }
  }
}
