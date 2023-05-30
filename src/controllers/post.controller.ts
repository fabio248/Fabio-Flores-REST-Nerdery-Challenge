import { Request, Response, NextFunction } from 'express';
import PostService from '../services/post.service';
import { User } from '@prisma/client';

export default class PostController {
  constructor(private readonly postService: PostService) {}
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body;
      const user = req['user'] as User;
      const newPost = await this.postService.create(input, user!.id);

      res.status(201).json({ message: 'post created', data: newPost });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
