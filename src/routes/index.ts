import { Router, Application } from 'express';
import { accountRouter } from './account.routes';
import { authRouter } from './auth.routes';
import { postRouter } from './post.routes';
import { commentRouter } from './comment.routes';

export default function routerApi(app: Application) {
  const router: Router = Router();

  app.use('/api/v1', router);
  router.use('/accounts', accountRouter);
  router.use('/auth', authRouter);
  router.use('/posts', postRouter);
  router.use('/comments', commentRouter);
}
