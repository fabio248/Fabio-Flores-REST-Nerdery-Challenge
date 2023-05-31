import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import PostService from '../services/post.service';
import { Post } from '@prisma/client';
import { CreateUsersLikePosts } from '../types/post';

export default class PostController {
  constructor(private readonly postService: PostService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body;
      const user = req['user'] as JwtPayload;
      const newPost = await this.postService.create(input, parseInt(user.sub!));

      res.status(201).json({ message: 'post created', data: newPost });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const post = await this.postService.findOne(+postId);
      res.status(200).json({ message: 'post found', data: post });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      const { postId } = req.params;
      const input = req.body;

      const updatedPost = await this.postService.update(
        +postId,
        input,
        +user.sub!,
      );
      res.status(200).json({ message: 'post updated', data: updatedPost });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      const { postId } = req.params;
      const response = await this.postService.delete(+postId, +user.sub!);

      res.status(200).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  }

  async findMany(_req: Request, res: Response, next: NextFunction) {
    try {
      const listPost: Post[] = await this.postService.all();

      res.status(200).json({ message: 'posts found', data: listPost });
    } catch (error) {
      next(error);
    }
  }
  async createReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const user = req.user as JwtPayload;
      const body = req.body;
      const input: CreateUsersLikePosts = {
        postId: +postId,
        userId: +user.sub!,
        type: body.type,
      };

      const newReaction = await this.postService.createReaction(input);

      res.status(201).json({ message: 'reaction created', data: newReaction });
    } catch (error) {
      next(error);
    }
  }
}
