import { Post } from '@prisma/client';
import config from '../config';
import dbPrisma from '../db/db.client';
import PrismaUserRepository from '../repositories/prisma.user.repository';
import { BaseRepositoryInteface } from '../repositories/repository.interface';
import { AuthService } from '../services/auth.service';
import { MailerService } from '../services/mailer.service';
import PostService from '../services/post.service';
import UserService from '../services/user.service';
import PrismaPostRepository from '../repositories/prisma.post.repository';
import PostController from '../controllers/post.controller';
let prismaUserRepo;
let userService: UserService;
let mailerService: MailerService;
let authService: AuthService;

let postService: PostService;
let prismaPostRepo: BaseRepositoryInteface<Post>;
let postController: PostController;

if (config.enviroment === 'development') {
  prismaUserRepo = new PrismaUserRepository(dbPrisma);
  userService = new UserService(prismaUserRepo);

  mailerService = new MailerService();

  authService = new AuthService(userService);

  prismaPostRepo = new PrismaPostRepository(dbPrisma);
  postService = new PostService(prismaPostRepo);

  postController = new PostController(postService);
}
export { userService, mailerService, authService, postController, postService };
