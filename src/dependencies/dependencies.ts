import config from '../config';
import dbPrisma from '../db/db.client';
import PrismaUserRepository from '../repositories/prisma.user.repository';
import {
  CommentRepository,
  PostRepository,
} from '../repositories/repository.interface';
import { AuthService } from '../services/auth.service';
import { MailerService } from '../services/mailer.service';
import PostService from '../services/post.service';
import UserService from '../services/user.service';
import PrismaPostRepository from '../repositories/prisma.post.repository';
import PostController from '../controllers/post.controller';
import CommentService from '../services/comment.service';
import CommentController from '../controllers/comment.controller';
import PrismaCommentRepository from '../repositories/prisma.comment.repository';

let prismaUserRepo;
let userService: UserService;
let mailerService: MailerService;
let authService: AuthService;

let prismaPostRepo: PostRepository;
let postService: PostService;
let postController: PostController;

let prismaCommentRepo: CommentRepository;
let commentService: CommentService;
let commentController: CommentController;

if (config.enviroment === 'development') {
  prismaUserRepo = new PrismaUserRepository(dbPrisma);
  userService = new UserService(prismaUserRepo);

  mailerService = new MailerService();

  authService = new AuthService(userService);

  prismaPostRepo = new PrismaPostRepository(dbPrisma);
  postService = new PostService(prismaPostRepo);
  postController = new PostController(postService);

  prismaCommentRepo = new PrismaCommentRepository(dbPrisma);
  commentService = new CommentService(prismaCommentRepo, postService);
  commentController = new CommentController(commentService);
}

export {
  userService,
  mailerService,
  authService,
  postService,
  postController,
  commentController,
};
